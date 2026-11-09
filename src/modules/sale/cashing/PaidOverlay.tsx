import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import useTheme from 'hooks/useTheme'
import { CustomButton } from 'styles'
import { currencyFormat } from 'utils'

export interface ICompletedSale {
  invoice?: string
  total?: { value: number, currency: string }
  // paid: cash / transfer, later: pay later, loan: sent as a loan
  kind: 'paid' | 'later' | 'loan'
}

const labels = {
  paid: { title: 'Invoice Paid', color: '#4caf50', icon: CheckCircleRoundedIcon },
  later: { title: 'Saved · Pay Later', color: '#ffb300', icon: ScheduleRoundedIcon },
  loan: { title: 'Sent as Loan', color: '#ffb300', icon: ScheduleRoundedIcon },
}

// Covers the product grid once a sale is checked out, so nothing more
// is added by mistake; Clear starts the next sale
export const PaidOverlay = ({ sale, onClear }: { sale: ICompletedSale, onClear: () => void }) => {
  const { theme } = useTheme()
  const { title, color, icon: Icon } = labels[sale.kind]

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 120,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#ffffff',
        textAlign: 'center',
      }}
    >
      {/* Sticky, so the message stays in view on a long product list */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          minHeight: 'min(100%, 70vh)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '60px 20px',
          boxSizing: 'border-box',
        }}
      >
      <Icon style={{ fontSize: 64, color }} />
      <div style={{ fontSize: 24, fontWeight: 'bold', letterSpacing: 0.5 }}>{title}</div>
      {sale.invoice && <div style={{ fontSize: 15, opacity: 0.8 }}>{sale.invoice}</div>}
      {sale.total && <div style={{ fontSize: 20 }}>{currencyFormat(sale.total.value, sale.total.currency)}</div>}
      <CustomButton
        styled={theme}
        onClick={onClear}
        autoFocus
        style={{ marginTop: 14, minWidth: 180, backgroundColor: '#ffffff', color: '#111111' }}
      >
        <RestartAltRoundedIcon style={{ fontSize: 20, marginRight: 6 }} />
        Clear
      </CustomButton>
      <div style={{ fontSize: 12, opacity: 0.55 }}>Start a new sale</div>
      </div>
    </div>
  )
}
