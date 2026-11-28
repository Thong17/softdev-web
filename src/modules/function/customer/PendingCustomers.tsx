import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, CircularProgress, IconButton, Tooltip } from '@mui/material'
import SyncRoundedIcon from '@mui/icons-material/SyncRounded'
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded'
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { DeleteDialog } from 'components/shared/table/DeleteDialog'
import { DeleteButton, UpdateButton } from 'components/shared/table/ActionButton'
import { CustomButton } from 'styles'
import useTheme from 'hooks/useTheme'
import useOffline from 'hooks/useOffline'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import { IPendingCustomer, PendingStatus, removePending } from 'shared/offline/db'
import { timeFormat } from 'utils'

declare type ColumnHeader = 'photo' | 'phone' | 'customer' | 'type' | 'capturedAt' | 'status' | 'message' | 'action'

const Thumbnail = ({ photo }: { photo?: Blob | null }) => {
  const src = useMemo(() => (photo ? URL.createObjectURL(photo) : undefined), [photo])
  useEffect(() => () => { src && URL.revokeObjectURL(src) }, [src])
  return <Avatar src={src} sx={{ width: 32, height: 32 }} />
}

// "Sync now" for the customer list header, shown only while customers added
// offline are waiting. It covers the times the automatic sync doesn't run.
export const SyncNowButton = ({ style }: { style?: React.CSSProperties }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { online, pending, syncing, sync } = useOffline()
  if (!pending.length) return null
  const disabled = !online || syncing

  return (
    <Tooltip title={online ? language['SYNC_NOW_HINT'] : language['YOU_ARE_OFFLINE']}>
      <span style={{ display: 'inline-flex', ...style }}>
        <CustomButton
          styled={theme}
          disabled={disabled}
          onClick={() => sync(pending.map((record) => record.clientId))}
          style={{ backgroundColor: `${theme.color.warning}22`, color: theme.color.warning, opacity: disabled ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
        >
          {syncing ? <CircularProgress size={14} style={{ color: theme.color.warning }} /> : <SyncRoundedIcon style={{ fontSize: 18 }} />}
          {syncing ? language['SYNCING'] : `${language['SYNC_NOW']} (${pending.length})`}
        </CustomButton>
      </span>
    </Tooltip>
  )
}

// Customers added on this device with no connection, before the sync saves
// them. Shown above the customer list only while any are waiting.
export const PendingCustomers = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { notify } = useNotify()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const { online, pending, syncing, lastSyncedAt, authExpired, sync } = useOffline()
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: string | null }>({ open: false, id: null })
  const canCreate = !!user?.privilege?.customer?.create

  if (!pending.length) return null

  const columnData: ITableColumn<ColumnHeader>[] = [
    { id: 'photo', label: '', minWidth: 40 },
    { id: 'phone', label: language['PHONE_NUMBER'], minWidth: 100 },
    { id: 'customer', label: language['CUSTOMER'], minWidth: 120 },
    { id: 'type', label: language['TYPE'], minWidth: 70 },
    { id: 'capturedAt', label: language['ADDED_AT'], minWidth: 110, noWrap: true },
    { id: 'status', label: language['STATUS'], minWidth: 80 },
    { id: 'message', label: language['NOTE'], minWidth: 160 },
    { id: 'action', label: language['ACTION'], minWidth: 130, align: 'right' },
  ]

  const statusChip = (status: PendingStatus) => {
    const look = {
      pending: { label: language['SYNC_WAITING'], color: theme.color.info },
      syncing: { label: language['SYNC_SYNCING'], color: theme.color.info },
      conflict: { label: language['SYNC_NAME_TAKEN'], color: theme.color.warning },
      invalid: { label: language['SYNC_INVALID'], color: theme.color.error },
      failed: { label: language['SYNC_RETRYING'], color: theme.color.warning },
    }[status]
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: theme.radius.primary, backgroundColor: `${look.color}22`, color: look.color, fontSize: 13, whiteSpace: 'nowrap' }}>
        {status === 'syncing' && <CircularProgress size={10} style={{ color: look.color }} />}
        {look.label}
      </span>
    )
  }

  const handleConfirmDelete = async (clientId) => {
    setDeleteDialog({ open: false, id: null })
    await removePending(clientId)
    notify('Offline customer removed', 'success')
  }

  // The conflicting customer is the same person: drop the offline copy and
  // open the saved one
  const keepExisting = async (record: IPendingCustomer) => {
    if (!record.conflictWith?.id) return
    await removePending(record.clientId)
    navigate(`/function/customer/update/${record.conflictWith.id}`)
  }

  const rows = pending.map((record) => {
    const body = record.body || {}
    const busy = syncing || record.status === 'syncing'
    return {
      id: record.clientId,
      photo: <Thumbnail photo={record.photo} />,
      phone: body.displayName || '--',
      customer: (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>{body.fullName || body.companyName || '--'}</span>
          {body.contact && <span style={{ fontSize: 12, color: theme.text.tertiary }}>{body.contact}</span>}
        </div>
      ),
      type: body.type === 'BUSINESS' ? language['BUSINESS'] : language['INDIVIDUAL'],
      capturedAt: timeFormat(record.capturedAt, 'YYYY-MM-DD HH:mm'),
      status: statusChip(record.status),
      message: record.message ? <span style={{ fontSize: 13, color: theme.text.secondary }}>{record.message}</span> : '--',
      action: (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {record.status === 'conflict' && record.conflictWith?.id && !record.conflictWith.isDeleted && (
            <Tooltip title={`${language['USE_EXISTING_CUSTOMER']} (${record.conflictWith.fullName || record.conflictWith.displayName})`}>
              <IconButton
                size='small'
                onClick={() => keepExisting(record)}
                aria-label={language['USE_EXISTING_CUSTOMER']}
                style={{ backgroundColor: `${theme.color.info}22`, borderRadius: theme.radius.primary, color: theme.color.info, marginLeft: 5 }}
              >
                <PersonSearchRoundedIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={online ? language['SYNC_THIS_CUSTOMER'] : language['YOU_ARE_OFFLINE']}>
            <span>
              <IconButton
                size='small'
                disabled={!online || busy}
                onClick={() => sync([record.clientId])}
                aria-label='Sync this customer'
                style={{ backgroundColor: `${theme.color.success}22`, borderRadius: theme.radius.primary, color: theme.color.success, marginLeft: 5, opacity: !online || busy ? 0.5 : 1 }}
              >
                <SyncRoundedIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
          {canCreate && <UpdateButton style={{ margin: 0 }} onClick={() => navigate(`/function/customer/offline/${record.clientId}`)} />}
          <DeleteButton onClick={() => setDeleteDialog({ open: true, id: record.clientId })} />
        </div>
      ),
    }
  })

  return (
    <div style={{ marginBottom: 25 }}>
      <DeleteDialog
        id={deleteDialog.id}
        isOpen={deleteDialog.open}
        title={language['REMOVE_OFFLINE_CUSTOMER']}
        description={language['REMOVE_OFFLINE_CUSTOMER_DESC']}
        handleConfirm={handleConfirmDelete}
        handleClose={() => setDeleteDialog({ open: false, id: null })}
      />
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <CloudOffRoundedIcon style={{ color: online ? theme.color.warning : theme.color.error, fontSize: 20 }} />
        <span style={{ color: theme.text.primary, fontSize: 15 }}>{language['OFFLINE_CUSTOMERS']} ({pending.length})</span>
        <span style={{ color: theme.text.quaternary, fontSize: 12 }}>
          {authExpired ? language['LOGIN_EXPIRED_TO_SYNC'] : lastSyncedAt ? `${language['LAST_SYNCED']} ${timeFormat(lastSyncedAt, 'YYYY-MM-DD HH:mm')}` : language['NOT_SYNCED_YET']}
        </span>
        {authExpired && (
          <CustomButton
            styled={theme}
            onClick={() => navigate('/login')}
            style={{ marginLeft: 'auto', backgroundColor: `${theme.color.warning}22`, color: theme.color.warning }}
          >
            {language['LOGIN']}
          </CustomButton>
        )}
      </div>
      <StickyTable columns={columnData} rows={rows} pagination={false} />
    </div>
  )
}
