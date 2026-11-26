import { useEffect, useRef, useState } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import { keyframes } from '@emotion/react'
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { HintBox } from 'components/shared/HintBox'
import Button from 'components/shared/Button'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'

export interface ICredentials {
  kind: 'created' | 'reset'
  username: string
  password: string
  role?: string
}

// Copies text; falls back to a hidden textarea where the Clipboard API isn't
// available (plain http other than localhost)
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const done = document.execCommand('copy')
    document.body.removeChild(area)
    return done
  }
}

// The copy icon pops into a check, and back again
const pop = keyframes`
  from { transform: scale(0.4); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`
const CopyIcon = ({ copied, size, color }: { copied: boolean, size: number, color: string }) => (
  // A new key on each change replays the pop, both ways
  <Box key={copied ? 'check' : 'copy'} component='span' sx={{ display: 'inline-flex', animation: `${pop} 220ms ease-out` }}>
    {copied ? <CheckRoundedIcon style={{ fontSize: size, color }} /> : <ContentCopyRoundedIcon style={{ fontSize: size }} />}
  </Box>
)

// Shown after a user is created or their password reset: the details to send
// them, each copyable, plus one ready-to-send message
export const CredentialsDialog = ({ credentials, onClose }: { credentials: ICredentials | null, onClose: () => void }) => {
  const { theme } = useTheme()
  const { notify } = useNotify()
  const { language } = useLanguage()
  const signInAt = `${window.location.origin}/login`
  // Which copy button shows its check (a row's label, or 'all')
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(timer.current), [])

  // No toast when it works: the button's icon turns into a check for a moment
  const copy = (key: string, text: string) => copyText(text).then((done) => {
    if (!done) return notify('Copy failed', 'error')
    clearTimeout(timer.current)
    setCopied(key)
    timer.current = setTimeout(() => setCopied(null), 1500)
  })

  const message = credentials
    ? [
      `${language['SIGN_IN_AT']}: ${signInAt}`,
      `${language['USERNAME']}: ${credentials.username}`,
      `${language['PASSWORD']}: ${credentials.password}`,
      '',
      language['CHANGE_PASSWORD_AFTER_SIGN_IN'],
    ].join('\n')
    : ''

  const rows = credentials
    ? [
      { label: language['USERNAME'], value: credentials.username, mono: false },
      { label: language['PASSWORD'], value: credentials.password, mono: true },
      ...(credentials.role ? [{ label: language['ROLE'], value: credentials.role, mono: false, noCopy: true }] : []),
      { label: language['SIGN_IN_AT'], value: signInAt, mono: false },
    ]
    : []

  return (
    <AlertDialog isOpen={!!credentials} handleClose={onClose}>
      <DialogTitle title={credentials?.kind === 'reset' ? language['PASSWORD_HAS_BEEN_RESET'] : language['USER_CREATED']} onClose={onClose} />
      {/* Dialogs render outside the page, so the theme text colour is set here */}
      <div style={{ width: 'min(520px, 92vw)', padding: '10px 20px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14, color: theme.text.primary }}>
        <HintBox>{language['CREDENTIALS_HINT']}</HintBox>
        <div style={{ display: 'flex', flexDirection: 'column', border: theme.border.quaternary, borderRadius: theme.radius.primary }}>
          {rows.map((row: any, index) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: index ? theme.border.quaternary : 'none' }}>
              <span style={{ width: 90, flexShrink: 0, fontSize: 13, color: theme.text.tertiary }}>{row.label}</span>
              <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere', fontFamily: row.mono ? 'monospace' : undefined, fontSize: row.mono ? 16 : 14, letterSpacing: row.mono ? 1 : undefined }}>
                {row.value}
              </span>
              {!row.noCopy && (
                <Tooltip title={copied === row.label ? language['COPIED'] : language['COPY']}>
                  <IconButton size='small' aria-label={`${language['COPY']} ${row.label}`} onClick={() => copy(row.label, row.value)} style={{ color: theme.text.secondary }}>
                    <CopyIcon copied={copied === row.label} size={18} color={theme.color.success} />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button onClick={onClose} style={{ backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}>
            {language['CLOSE'] || 'Close'}
          </Button>
          <Button onClick={() => copy('all', message)} style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}>
            <span style={{ display: 'inline-flex', marginRight: 6 }}>
              <CopyIcon copied={copied === 'all'} size={17} color={theme.color.success} />
            </span>
            {copied === 'all' ? language['COPIED'] : language['COPY_ALL']}
          </Button>
        </div>
      </div>
    </AlertDialog>
  )
}
