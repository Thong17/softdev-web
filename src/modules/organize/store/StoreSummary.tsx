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
import useLanguage from 'hooks/useLanguage'

// Labels are language keys
const featureNames = [
  { key: 'labelPrinting', label: 'LABEL_PRINTING' },
  { key: 'tables', label: 'TABLES_LAYOUT' },
  { key: 'reservation', label: 'RESERVATION' },
  { key: 'queue', label: 'QUEUE' },
]

// Store page: what's set up for payment, printing and features, each linking
// to its page (Organize › Store › Payment / Printing / Features)
export const StoreSummary = ({ storeId, layout }: { storeId?: string, layout?: { floors?: number, rooms?: number, tables?: number } }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
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
  const state = (on: boolean, onText = language['ON'], offText = language['OFF']) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: on ? theme.color.success : theme.text.quaternary }} />
      {on ? onText : offText}
    </span>
  )
  const printer = (name?: string, detail?: string) => name ? `${name}${detail ? ` · ${detail}` : ''}` : <span style={muted}>{language['NOT_SET']}</span>

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
            {language['MANAGE']}<ChevronRightRoundedIcon style={{ fontSize: 18 }} />
          </span>
        )}
      </div>
      <div>{body}</div>
    </div>
  )

  const soft = setting?.softInvoice
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
      {card(language['PAYMENT'], <PaymentsRoundedIcon />, `/organize/store/${storeId}/payment`, transfers === null
        ? <span style={{ ...muted, fontSize: 13 }}>--</span>
        : (
          <>
            {row(language['CASH'], state(true, language['ALWAYS_ON']))}
            {row(language['TRANSFER_METHODS'], transfers.length || language['NONE'])}
            {transfers.slice(0, 3).map((transfer) => row(transfer.title || language['TRANSFER'], state(!!transfer.image?.filename, language['QR_SET'], language['NO_QR'])))}
            {transfers.length > 3 && <div style={{ ...muted, fontSize: 12, paddingTop: 4 }}>{language['N_MORE'].replace('{n}', transfers.length - 3)}</div>}
          </>
        ))}
      {card(language['PRINTING'], <LocalPrintshopRoundedIcon />, `/organize/store/${storeId}/printing`, setting === null
        ? <span style={{ ...muted, fontSize: 13 }}>--</span>
        : (
          <>
            {row(language['RECEIPT_PRINTER'], printer(setting.receiptPrinterName, setting.receiptPrinterCharPerLine ? language['N_CHARS'].replace('{n}', setting.receiptPrinterCharPerLine) : ''))}
            {row(language['STORE_COPY_PRINTER'], printer(setting.storePrinterName, setting.storePrinterCharPerLine ? language['N_CHARS'].replace('{n}', setting.storePrinterCharPerLine) : ''))}
            {features.labelPrinting && row(language['LABEL_PRINTER'], printer(setting.thermalPrinterName, setting.thermalPrinterWidth ? `${setting.thermalPrinterWidth}×${setting.thermalPrinterHeight || '?'} mm` : ''))}
            {row(language['SOFT_INVOICE'], state(!!soft?.enabled, `${language['ON']} · ${soft?.paperSize || 'A4'}`))}
          </>
        ))}
      {features.tables && card(language['LAYOUT'], <TableBarRoundedIcon />, `/organize/store/${storeId}/layout`, (
        <>
          {row(language['FLOORS'], layout?.floors ?? '--')}
          {row(language['ROOMS'], layout?.rooms ?? '--')}
          {row(language['TABLES'], layout?.tables ?? '--')}
        </>
      ))}
      {card(language['FEATURES'], <TuneRoundedIcon />, `/organize/store/${storeId}/features`, (
        <>
          {featureNames.map((feature) => row(language[feature.label], state(!!features[feature.key])))}
        </>
      ))}
    </div>
  )
}
