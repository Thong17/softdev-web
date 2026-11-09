import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import TableBarRoundedIcon from '@mui/icons-material/TableBarRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import useStoreFeatures from 'hooks/useStoreFeatures'

const featureNames = [
  { key: 'labelPrinting', label: 'Label printing' },
  { key: 'tables', label: 'Tables & layout' },
  { key: 'reservation', label: 'Reservation' },
  { key: 'queue', label: 'Queue' },
]

// Store page: what's set up for payment, printing and features, each linking
// to its page (Organize › Store › Payment / Printing / Features)
export const StoreSummary = ({ storeId, layout }: { storeId?: string, layout?: { floors?: number, rooms?: number, tables?: number } }) => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const features = useStoreFeatures()
  const [setting, setSetting] = useState<any>(null)
  const [transfers, setTransfers] = useState<any[] | null>(null)
  const canManage = !!user?.privilege?.store?.update

  useEffect(() => {
    Axios({ method: 'GET', url: '/organize/store/getTelegramSetting' })
      .then((response) => setSetting(response?.data?.data || {}))
      .catch(() => setSetting(null))
    Axios({ method: 'GET', url: '/organize/store/transfer' })
      .then((response) => setTransfers(response?.data?.data || []))
      .catch(() => setTransfers(null))
  }, [])

  const muted = { color: theme.text.tertiary }
  const row = (label: string, value: ReactNode) => (
    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '5px 0', borderBottom: theme.border.quaternary, fontSize: 13 }}>
      <span style={muted}>{label}</span>
      <span style={{ color: theme.text.secondary, textAlign: 'right', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
  const state = (on: boolean, onText = 'On', offText = 'Off') => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: on ? theme.color.success : theme.text.quaternary }} />
      {on ? onText : offText}
    </span>
  )
  const printer = (name?: string, detail?: string) => name ? `${name}${detail ? ` · ${detail}` : ''}` : <span style={muted}>Not set</span>

  const card = (title: string, icon: ReactNode, path: string, body: ReactNode) => (
    <div style={{ padding: 16, borderRadius: theme.radius.secondary, border: theme.border.quaternary, backgroundColor: theme.background.primary, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ display: 'flex', color: theme.color.info }}>{icon}</span>
        <span style={{ color: theme.text.primary, fontSize: 15, flex: 1 }}>{title}</span>
        {canManage && storeId && (
          <span
            role='button'
            onClick={() => navigate(path)}
            style={{ display: 'inline-flex', alignItems: 'center', color: theme.color.info, fontSize: 13, cursor: 'pointer' }}
          >
            Manage<ChevronRightRoundedIcon style={{ fontSize: 18 }} />
          </span>
        )}
      </div>
      <div>{body}</div>
    </div>
  )

  const soft = setting?.softInvoice
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
      {card('Payment', <PaymentsRoundedIcon />, `/organize/store/${storeId}/payment`, transfers === null
        ? <span style={{ ...muted, fontSize: 13 }}>--</span>
        : (
          <>
            {row('Cash', state(true, 'Always on'))}
            {row('Transfer methods', transfers.length || 'None')}
            {transfers.slice(0, 3).map((transfer) => row(transfer.title || 'Transfer', state(!!transfer.image?.filename, 'QR set', 'No QR')))}
            {transfers.length > 3 && <div style={{ ...muted, fontSize: 12, paddingTop: 4 }}>+{transfers.length - 3} more</div>}
          </>
        ))}
      {card('Printing', <LocalPrintshopRoundedIcon />, `/organize/store/${storeId}/printing`, setting === null
        ? <span style={{ ...muted, fontSize: 13 }}>--</span>
        : (
          <>
            {row('Receipt printer', printer(setting.receiptPrinterName, setting.receiptPrinterCharPerLine ? `${setting.receiptPrinterCharPerLine} chars` : ''))}
            {row('Store copy printer', printer(setting.storePrinterName, setting.storePrinterCharPerLine ? `${setting.storePrinterCharPerLine} chars` : ''))}
            {features.labelPrinting && row('Label printer', printer(setting.thermalPrinterName, setting.thermalPrinterWidth ? `${setting.thermalPrinterWidth}×${setting.thermalPrinterHeight || '?'} mm` : ''))}
            {row('Soft invoice', state(!!soft?.enabled, `On · ${soft?.paperSize || 'A4'}`))}
          </>
        ))}
      {features.tables && card('Layout', <TableBarRoundedIcon />, `/organize/store/${storeId}/layout`, (
        <>
          {row('Floors', layout?.floors ?? '--')}
          {row('Rooms', layout?.rooms ?? '--')}
          {row('Tables', layout?.tables ?? '--')}
        </>
      ))}
      {card('Features', <TuneRoundedIcon />, `/organize/store/${storeId}/features`, (
        <>
          {featureNames.map((feature) => row(feature.label, state(!!features[feature.key])))}
        </>
      ))}
    </div>
  )
}
