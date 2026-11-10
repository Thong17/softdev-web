import { ReactNode } from 'react'
import moment from 'moment'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import useTheme from 'hooks/useTheme'
import { currencyFormat } from 'utils'

export interface IPayLaterValue {
  dueDate: string
  note: string
  feeValue: string
  feeType: 'PCT' | 'USD' | 'KHR'
}

export const initPayLater: IPayLaterValue = { dueDate: '', note: '', feeValue: '', feeType: 'PCT' }

// Same rule as the API: a one-time fee on what's owed after the deposit
export const payLaterAmounts = (total: number, deposit: number, value: IPayLaterValue, sellRate: number) => {
  const paid = Math.min(Math.max(deposit || 0, 0), total)
  const base = Math.max(0, total - paid)
  const feeNumber = Number(value.feeValue) || 0
  const fee = value.feeType === 'PCT' ? (base * feeNumber) / 100 : value.feeType === 'KHR' ? feeNumber / (sellRate || 4000) : feeNumber
  return { paid, fee: Math.round(fee * 100) / 100, balance: Math.round((base + fee) * 100) / 100 }
}

// Payment dialog › Pay Later: sell now, pay over time. Takes an optional
// deposit (the cash form passed in), a due date, a one-time fee and a note.
export const PayLaterForm = ({ customer, total, deposit, sellRate, value, onChange, depositForm }: {
  customer?: any
  total: number
  deposit: number
  sellRate: number
  value: IPayLaterValue
  onChange: (value: IPayLaterValue) => void
  depositForm: ReactNode
}) => {
  const { theme } = useTheme()
  const { paid, fee, balance } = payLaterAmounts(total, deposit, value, sellRate)
  const tooMuch = deposit > total + 0.01
  const feeError = (Number(value.feeValue) || 0) < 0 || (value.feeType === 'PCT' && Number(value.feeValue) > 100)
  const change = (patch: Partial<IPayLaterValue>) => onChange({ ...value, ...patch })

  const input = {
    height: 36,
    padding: '0 10px',
    boxSizing: 'border-box' as const,
    border: theme.border.quaternary,
    borderRadius: theme.radius.primary,
    background: 'transparent',
    color: theme.text.primary,
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
  }
  const label = { fontSize: 12, color: theme.text.tertiary, marginBottom: 4, display: 'block' }
  const line = (name: string, amount: ReactNode, strong = false) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: strong ? 16 : 14, fontWeight: strong ? 'bold' : 'normal', color: strong ? theme.text.primary : theme.text.secondary }}>
      <span>{name}</span>
      <span>{amount}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%' }}>
      {/* Who owes the balance */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          borderRadius: theme.radius.secondary,
          backgroundColor: customer?.id ? `${theme.color.info}14` : `${theme.color.error}14`,
          color: customer?.id ? theme.text.secondary : theme.color.error,
          fontSize: 14,
        }}
      >
        {customer?.id ? <PersonRoundedIcon style={{ fontSize: 20, color: theme.color.info }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20 }} />}
        {customer?.id
          ? <span>{customer.fullName || customer.displayName} <span style={{ color: theme.text.tertiary }}>· {customer.displayName}</span></span>
          : <span>Choose a customer in the cart first. Pay Later needs to know who owes the balance.</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label>
          <span style={label}>Due date</span>
          <input
            type='date'
            value={value.dueDate}
            min={moment().format('YYYY-MM-DD')}
            onChange={(event) => change({ dueDate: event.target.value })}
            style={{ ...input, width: '100%', colorScheme: 'light dark' }}
          />
        </label>
        <label>
          <span style={label}>Fee (optional, once on the balance)</span>
          <span style={{ display: 'flex', gap: 6 }}>
            <input
              type='number'
              min='0'
              step='any'
              placeholder='0'
              value={value.feeValue}
              onChange={(event) => change({ feeValue: event.target.value })}
              style={{ ...input, flex: 1, minWidth: 0, borderColor: feeError ? theme.color.error : undefined }}
            />
            <select value={value.feeType} onChange={(event) => change({ feeType: event.target.value as IPayLaterValue['feeType'] })} style={{ ...input, width: 64, backgroundColor: theme.background.primary }}>
              <option value='PCT'>%</option>
              <option value='USD'>$</option>
              <option value='KHR'>៛</option>
            </select>
          </span>
        </label>
      </div>

      <label>
        <span style={label}>Note</span>
        <input type='text' value={value.note} maxLength={500} placeholder='e.g. pays every Friday' onChange={(event) => change({ note: event.target.value })} style={{ ...input, width: '100%' }} />
      </label>

      <div>
        <span style={label}>Paid now (optional deposit)</span>
        {depositForm}
      </div>

      {/* Totals stay pinned to the bottom while the deposit list scrolls */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
          marginTop: 'auto',
          padding: '10px 14px',
          borderRadius: theme.radius.secondary,
          border: theme.border.quaternary,
          backgroundColor: theme.background.primary,
          boxShadow: theme.shadow.secondary,
        }}
      >
        {line('Total', currencyFormat(total, 'USD'))}
        {line('Paid now', currencyFormat(paid, 'USD'))}
        {fee > 0 && line(`Fee${value.feeType === 'PCT' ? ` (${value.feeValue}%)` : ''}`, currencyFormat(fee, 'USD'))}
        <div style={{ borderTop: theme.border.quaternary, marginTop: 4, paddingTop: 4 }}>
          {line('Balance owed', currencyFormat(balance, 'USD'), true)}
        </div>
        {tooMuch && <div style={{ color: theme.color.error, fontSize: 12, marginTop: 4 }}>The deposit is more than the total; use Cash or Transfer instead.</div>}
        {feeError && <div style={{ color: theme.color.error, fontSize: 12, marginTop: 4 }}>The fee must be 0 or more, and a % fee at most 100.</div>}
      </div>
    </div>
  )
}
