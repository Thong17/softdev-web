import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { Checkbox, Radio } from '@mui/material'
import BackupRoundedIcon from '@mui/icons-material/BackupRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import SettingsBackupRestoreRoundedIcon from '@mui/icons-material/SettingsBackupRestoreRounded'
import { Section } from 'components/shared/Section'
import { HintBox } from 'components/shared/HintBox'
import Button from 'components/shared/Button'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'

interface IResetGroup {
  key: string
  label: string
  detail: string
  requires: string[]
}

interface IServerBackup {
  name: string
  kind: 'folder' | 'archive'
  size: number
  createdAt: string
}

type ResetMode = 'selective' | 'hard'

// What the confirm dialog is about to do
type Pending =
  | { kind: 'reset' }
  | { kind: 'restore-file', file: File }
  | { kind: 'restore-server', backup: IServerBackup }

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

// Backup, restore, or wipe data back to a clean start (e.g. after a demo ends).
// Every reset and restore saves a backup of the current data first and stops if that fails.
export const DataSection = () => {
  const { theme } = useTheme()
  const { notify } = useNotify()
  const [groups, setGroups] = useState<IResetGroup[]>([])
  const [mode, setMode] = useState<ResetMode>('selective')
  const [picked, setPicked] = useState<string[]>(['sales'])
  const [backingUp, setBackingUp] = useState(false)
  const [backups, setBackups] = useState<IServerBackup[]>([])
  const [showAllBackups, setShowAllBackups] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<Pending | null>(null)
  const [confirmText, setConfirmText] = useState('')
  const [working, setWorking] = useState(false)

  const loadBackups = () => {
    Axios({ method: 'GET', url: '/utility/backups' })
      .then((res) => setBackups(res?.data?.data || []))
      .catch(() => setBackups([]))
  }

  useEffect(() => {
    Axios({ method: 'GET', url: '/utility/reset-options' })
      .then((res) => setGroups(res?.data?.data || []))
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
    loadBackups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Groups that must go too because a picked group points at them,
  // keyed by the group, with the names of the picked groups that need it
  const neededBy: Record<string, string[]> = {}
  const add = (key: string, by: string) => {
    const group = groups.find((item) => item.key === key)
    if (!group) return
    group.requires.forEach((required) => {
      if (!neededBy[required]?.includes(by)) neededBy[required] = [...(neededBy[required] || []), by]
      add(required, by)
    })
  }
  picked.forEach((key) => add(key, groups.find((item) => item.key === key)?.label || key))
  const included = groups.filter((group) => picked.includes(group.key) || neededBy[group.key]).map((group) => group.key)

  const toggle = (key: string) => {
    setPicked((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]))
  }

  // Asks where to save first (Chrome / Edge), then streams the backup straight
  // into that file. Other browsers download it the usual way.
  const handleBackup = async () => {
    const filename = `backup-${moment().format('YYYY-MM-DD-HHmm')}.archive.gz`
    const picker = (window as any).showSaveFilePicker
    let handle: any = null
    if (picker) {
      try {
        handle = await picker({
          suggestedName: filename,
          types: [{ description: 'Database backup', accept: { 'application/gzip': ['.gz'] } }],
        })
      } catch (err: any) {
        if (err?.name === 'AbortError') return // the save dialog was cancelled
      }
    }

    setBackingUp(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/utility/backup-download`, {
        headers: { 'x-access-token': window.localStorage.getItem('x-access-token') || '' },
      })
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.msg || 'Backup failed')
      }
      if (handle) {
        // A failure part way aborts the write, so no broken file is left
        await response.body.pipeTo(await handle.createWritable())
      } else {
        const url = URL.createObjectURL(await response.blob())
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
      notify(handle ? `Backup saved as ${handle.name}` : 'Backup downloaded', 'success')
    } catch (err: any) {
      notify(err?.message === 'Failed to fetch' ? 'Backup stopped: the connection was lost' : err?.message || 'Backup failed', 'error')
    } finally {
      setBackingUp(false)
    }
  }

  const ask = (next: Pending) => {
    setConfirmText('')
    setPending(next)
  }

  const openResetConfirm = () => {
    if (mode === 'selective' && !included.length) return notify('Choose what to reset', 'error')
    ask({ kind: 'reset' })
  }

  const handleFilePicked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = '' // picking the same file again still fires
    if (file) ask({ kind: 'restore-file', file })
  }

  // Sends the file as the raw body; the server saves, checks and restores it
  const uploadRestore = async (file: File) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/utility/restore-upload`, {
      method: 'POST',
      headers: {
        'x-access-token': window.localStorage.getItem('x-access-token') || '',
        'x-confirm': confirmText,
        'Content-Type': 'application/octet-stream',
      },
      body: file,
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) throw new Error(data?.msg || 'Restore failed')
    return data?.msg
  }

  const word = pending?.kind === 'reset' ? 'RESET' : 'RESTORE'

  const handleConfirm = async () => {
    if (!pending) return
    setWorking(true)
    try {
      let msg: string
      if (pending.kind === 'reset') {
        msg = (await Axios({ method: 'POST', url: '/utility/reset', body: { mode, groups: picked, confirm: confirmText } }))?.data?.msg
      } else if (pending.kind === 'restore-server') {
        msg = (await Axios({ method: 'POST', url: '/utility/restore', body: { backup: pending.backup.name, confirm: confirmText } }))?.data?.msg
      } else {
        msg = await uploadRestore(pending.file)
      }
      notify(msg, 'success')
      setPending(null)
      // Cached store data, drawer and cart on this page are now stale (and after
      // a restore this account may not exist any more)
      setTimeout(() => window.location.reload(), 1500)
    } catch (err: any) {
      notify(err?.response?.data?.msg || err?.message || 'Something went wrong', 'error')
      loadBackups()
    } finally {
      setWorking(false)
    }
  }

  const card = (active: boolean, color = theme.color.info) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px 10px 6px',
    borderRadius: theme.radius.secondary,
    border: active ? `1px solid ${color}66` : theme.border.quaternary,
    backgroundColor: active ? `${color}0d` : 'transparent',
    cursor: 'pointer',
  })
  // MUI's own checkbox/radio colors ignore the app theme
  const control = (color: string) => ({
    color: theme.text.quaternary,
    '&.Mui-checked': { color },
    '&.Mui-disabled.Mui-checked': { color, opacity: 0.5 },
  })
  const title = { display: 'block', color: theme.text.primary, fontSize: 15 }
  const detail = { display: 'block', color: theme.text.tertiary, fontSize: 13 }

  const resetSummary = mode === 'hard'
    ? 'Everything: sales, customers, products, stock, users, roles, the store and its settings. Only Super Admin accounts stay.'
    : groups.filter((group) => included.includes(group.key)).map((group) => group.label).join(', ')

  const backupLabel = (backup: IServerBackup) => {
    // "2026-11-17T13-43-29.514Z-before-reset" reads as "Before reset"
    const reason = backup.name.replace(/^\d{4}-\d{2}-\d{2}T[\d-]+\.\d+Z-?/, '').replace(/\.archive\.gz$/, '').replace(/-/g, ' ')
    return reason ? reason.charAt(0).toUpperCase() + reason.slice(1) : 'Backup'
  }
  const visibleBackups = showAllBackups ? backups : backups.slice(0, 5)

  return (
    <Section describe='Data' style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}>
          <span style={{ flex: 1, minWidth: 200 }}>
            <span style={title}>Backup</span>
            <span style={detail}>Saves a full copy of the database as one file, wherever you choose.</span>
          </span>
          <Button
            loading={backingUp}
            onClick={handleBackup}
            style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
          >
            <BackupRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
            Backup now
          </Button>
        </div>

        <div style={{ borderTop: theme.border.dashed, margin: '6px 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}>
          <span style={{ flex: 1, minWidth: 200 }}>
            <span style={title}>Restore</span>
            <span style={detail}>Replaces all current data with a backup. The current data is saved to the server's backup folder first, and put back if the restore fails.</span>
          </span>
          <input ref={fileInput} type='file' accept='.gz' onChange={handleFilePicked} style={{ display: 'none' }} />
          <Button
            onClick={() => fileInput.current?.click()}
            style={{ backgroundColor: `${theme.color.warning}22`, color: theme.color.warning }}
          >
            <SettingsBackupRestoreRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
            Restore from file
          </Button>
        </div>
        {backups.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ ...detail, marginTop: 4 }}>Or restore one saved on the server</span>
            {visibleBackups.map((backup) => (
              <div
                key={backup.name}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px 6px 14px', border: theme.border.quaternary, borderRadius: theme.radius.secondary }}
              >
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ ...title, fontSize: 14 }}>{backupLabel(backup)}</span>
                  <span style={{ ...detail, fontSize: 12 }}>{moment(backup.createdAt).format('DD MMM YYYY, HH:mm')} · {formatSize(backup.size)}</span>
                </span>
                <Button
                  onClick={() => ask({ kind: 'restore-server', backup })}
                  style={{ backgroundColor: `${theme.color.warning}18`, color: theme.color.warning }}
                >
                  Restore
                </Button>
              </div>
            ))}
            {backups.length > 5 && (
              <span
                onClick={() => setShowAllBackups((prev) => !prev)}
                style={{ ...detail, color: theme.color.info, cursor: 'pointer', alignSelf: 'start' }}
              >
                {showAllBackups ? 'Show fewer' : `Show all ${backups.length}`}
              </span>
            )}
          </div>
        )}

        <div style={{ borderTop: theme.border.dashed, margin: '6px 0' }} />

        <span>
          <span style={title}>Reset</span>
          <span style={detail}>Clears data back to a clean start, e.g. when a demo ends. A backup is always taken first, and nothing is cleared if it fails.</span>
        </span>

        <label style={card(mode === 'selective')}>
          <Radio size='small' sx={control(theme.color.info)} checked={mode === 'selective'} onChange={() => setMode('selective')} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={title}>Choose what to reset</span>
            <span style={detail}>Settings, the store and its layout, users and roles, customer tiers, cash presets and announcements stay as they are.</span>
          </span>
        </label>

        {mode === 'selective' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20 }}>
            {groups.map((group) => {
              const forced = !picked.includes(group.key) && !!neededBy[group.key]
              const on = included.includes(group.key)
              return (
                <label key={group.key} style={{ ...card(on, theme.color.error), cursor: forced ? 'default' : 'pointer' }}>
                  <Checkbox size='small' sx={control(theme.color.error)} checked={on} disabled={forced} onChange={() => toggle(group.key)} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={title}>{group.label}</span>
                    <span style={detail}>
                      {group.detail}
                      {forced && <span style={{ color: theme.color.warning }}> · also cleared, since {neededBy[group.key].join(' and ')} point{neededBy[group.key].length === 1 ? 's' : ''} at it</span>}
                    </span>
                  </span>
                </label>
              )
            })}
            {included.includes('sales') && !included.includes('stock') && (
              <HintBox>Stock that stays gets back what was sold from it, and customers that stay start again with no spend, points or earned tier.</HintBox>
            )}
          </div>
        )}

        <label style={card(mode === 'hard', theme.color.error)}>
          <Radio size='small' sx={control(theme.color.error)} checked={mode === 'hard'} onChange={() => setMode('hard')} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={title}>Hard reset</span>
            <span style={detail}>Back to a fresh install: every record is cleared and the store starts with default settings. Super Admin accounts stay with their passwords.</span>
          </span>
        </label>

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={openResetConfirm}
            style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}
          >
            <RestartAltRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
            {mode === 'hard' ? 'Hard reset' : 'Reset selected'}
          </Button>
        </div>
      </div>

      <AlertDialog isOpen={!!pending} handleClose={() => !working && setPending(null)}>
        <DialogTitle
          title={pending?.kind === 'reset' ? (mode === 'hard' ? 'Hard reset' : 'Reset data') : 'Restore backup'}
          onClose={() => !working && setPending(null)}
        />
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 440, color: theme.text.secondary }}>
          {pending?.kind === 'reset' && <span>This clears: <b style={{ color: theme.text.primary }}>{resetSummary}</b></span>}
          {pending?.kind === 'restore-file' && (
            <span>All current data is replaced by <b style={{ color: theme.text.primary }}>{pending.file.name}</b> ({formatSize(pending.file.size)}). Users and passwords become the ones in that backup.</span>
          )}
          {pending?.kind === 'restore-server' && (
            <span>All current data is replaced by the backup <b style={{ color: theme.text.primary }}>{backupLabel(pending.backup)}</b> from {moment(pending.backup.createdAt).format('DD MMM YYYY, HH:mm')}. Users and passwords become the ones in that backup.</span>
          )}
          <span>The current data is saved first. Type <b style={{ color: theme.color.error }}>{word}</b> to continue.</span>
          <input
            autoFocus
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            placeholder={word}
            style={{
              height: 38,
              padding: '0 12px',
              border: theme.border.quaternary,
              borderRadius: theme.radius.primary,
              background: 'transparent',
              color: theme.text.primary,
              fontFamily: 'inherit',
              fontSize: 15,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
            <Button
              disabled={working}
              onClick={() => setPending(null)}
              style={{ backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}
            >
              Cancel
            </Button>
            <Button
              loading={working}
              disabled={confirmText !== word}
              onClick={handleConfirm}
              style={{ backgroundColor: `${theme.color.error}${confirmText === word ? '33' : '11'}`, color: theme.color.error }}
            >
              {pending?.kind === 'reset' ? 'Back up and reset' : 'Back up and restore'}
            </Button>
          </div>
        </div>
      </AlertDialog>
    </Section>
  )
}
