import { useEffect, useState } from 'react'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { CashForm } from 'components/shared/form/CashForm'
import { SelectTab } from 'components/shared/form/SelectTab'
import { CustomButton } from 'styles'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import { currencyFormat, timeFormat } from 'utils'

// Records money received towards a Pay Later sale (cash or transfer). Any
// amount up to what's owed; extra cash is given back as change. An optional
// fee (e.g. a late fee) is added to what's owed before the payment.
export const CollectDialog = ({ payment, onClose, onCollected }: { payment: any | null, onClose: () => void, onCollected: () => void }) => {
  const { theme } = useTheme()
  const { width } = useWeb()
  const { user } = useAuth()
  const { notify } = useNotify()
  const [method, setMethod] = useState<'cash' | 'transfer'>('cash')
  const [cashes, setCashes] = useState<any[]>([])
  const [transfer, setTransfer] = useState('')
  const [feeValue, setFeeValue] = useState('')
  const [feeType, setFeeType] = useState<'PCT' | 'USD' | 'KHR'>('PCT')
  const [saving, setSaving] = useState(false)
  // CashForm keeps its own list; a new key starts it empty
  const [formKey, setFormKey] = useState(0)
  const sellRate = user?.drawer?.sellRate || payment?.rate?.sellRate || 4000
  const owed = Number(payment?.balance?.USD) || 0

  useEffect(() => {
    setMethod('cash')
    setCashes([])
    setTransfer(owed ? owed.toFixed(2) : '')
    setFeeValue('')
    setFeeType('PCT')
    setFormKey((key) => key + 1)
  }, [payment?._id, owed])

  const cashUSD = cashes.reduce((sum, cash) => sum + (cash.currency === 'USD' ? cash.value * cash.quantity : 0), 0)
  const cashKHR = cashes.reduce((sum, cash) => sum + (cash.currency === 'KHR' ? cash.value * cash.quantity : 0), 0)
  const received = method === 'cash' ? cashUSD + cashKHR / sellRate : Number(transfer) || 0

  // Same rule as the API: % of what's owed now; riel at the sale's rate
  const feeOf = (value: string, type: string) => {
    const number = Number(value) || 0
    const amount = type === 'PCT' ? (owed * number) / 100 : type === 'KHR' ? number / (payment?.rate?.sellRate || 4000) : number
    return Math.round(Math.max(0, amount) * 100) / 100
  }
  const feeNow = feeOf(feeValue, feeType)
  const feeError = (Number(feeValue) || 0) < 0 || (feeType === 'PCT' && Number(feeValue) > 100)
  const due = Math.round((owed + feeNow) * 100) / 100

  const paid = Math.min(received, due)
  // Only cash gives change; a transfer can't be more than what's owed
  const change = method === 'cash' ? Math.max(0, received - due) : 0
  const transferTooMuch = method === 'transfer' && received > due + 0.01
  const left = Math.max(0, due - received)

  // A transfer usually pays everything, so it follows what's owed with the fee
  const changeFee = (value: string, type: 'PCT' | 'USD' | 'KHR') => {
    setFeeValue(value)
    setFeeType(type)
    if (method === 'transfer') setTransfer((owed + feeOf(value, type)).toFixed(2))
  }

  const handleCollect = () => {
    if (feeError) return notify('The fee must be 0 or more, and a % fee at most 100', 'error')
    if (received <= 0) return notify('Enter the amount received', 'error')
    if (transferTooMuch) return notify("A transfer can't be more than what's owed", 'error')
    if (!user?.drawer) return notify('Open drawer first!', 'error')
    setSaving(true)
    Axios({
      method: 'POST',
      url: `/sale/payment/collect/${payment._id}`,
      body: {
        ...(method === 'cash'
          ? { paymentMethod: 'cash', receiveCashes: cashes, receiveTotal: { USD: cashUSD, KHR: cashKHR, total: received } }
          : { paymentMethod: 'transfer', receiveCashes: [], receiveTotal: { USD: received, KHR: 0, total: received } }),
        fee: Number(feeValue) ? { value: Number(feeValue), type: feeType } : null,
      },
    })
      .then((response) => {
        notify(response?.data?.msg, 'success')
        onCollected()
        onClose()
      })
      .catch((err) => notify(err?.response?.data?.msg || 'Could not record the payment', 'error'))
      .finally(() => setSaving(false))
  }

  const line = (label: string, value: any, strong = false, color?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: strong ? 16 : 14, fontWeight: strong ? 'bold' : 'normal', color: color || (strong ? theme.text.primary : theme.text.secondary) }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )

  // Fees so far: at checkout plus any added when collecting
  const fee = (payment?.payLater?.fee?.amount || 0) + (payment?.payLater?.collectFees || 0)
  const input = { height: 36, padding: '0 10px', boxSizing: 'border-box' as const, border: theme.border.quaternary, borderRadius: theme.radius.primary, background: 'transparent', color: theme.text.primary, fontFamily: 'inherit', fontSize: 14, outline: 'none' }
  const overdue = payment?.payLater?.dueDate && new Date(payment.payLater.dueDate) < new Date()

  return (
    <AlertDialog isOpen={!!payment} handleClose={() => !saving && onClose()}>
      {/* Fixed 80vh: the cash list takes the free space and scrolls */}
      <div style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <DialogTitle title={`Collect Payment${payment?.invoice ? ` · ${payment.invoice}` : ''}`} onClose={() => !saving && onClose()} />
      <div style={{ width: width < 1024 ? '92vw' : 560, padding: '0 20px 20px 20px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ padding: '10px 14px', borderRadius: theme.radius.secondary, border: theme.border.quaternary }}>
          {line('Customer', payment?.customer?.fullName || payment?.customer?.displayName || '--')}
          {line('Sale total', currencyFormat(payment?.total?.value, payment?.total?.currency))}
          {fee > 0 && line('Fee', currencyFormat(fee, 'USD'))}
          {line('Paid so far', currencyFormat(payment?.paidTotal || 0, 'USD'))}
          {payment?.payLater?.dueDate && line('Due date', timeFormat(payment.payLater.dueDate, 'YYYY-MM-DD'), false, overdue ? theme.color.error : undefined)}
          <div style={{ borderTop: theme.border.quaternary, marginTop: 4, paddingTop: 4 }}>
            {line('Owed', currencyFormat(owed, 'USD'), true)}
          </div>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, color: theme.text.tertiary }}>Fee now (optional, e.g. a late fee; added to what's owed)</span>
          <span style={{ display: 'flex', gap: 6 }}>
            <input
              type='number'
              min='0'
              step='any'
              placeholder='0'
              value={feeValue}
              onChange={(event) => changeFee(event.target.value, feeType)}
              style={{ ...input, flex: 1, minWidth: 0, borderColor: feeError ? theme.color.error : undefined }}
            />
            <select value={feeType} onChange={(event) => changeFee(feeValue, event.target.value as 'PCT' | 'USD' | 'KHR')} style={{ ...input, width: 64, backgroundColor: theme.background.primary }}>
              <option value='PCT'>%</option>
              <option value='USD'>$</option>
              <option value='KHR'>៛</option>
            </select>
          </span>
        </label>

        <SelectTab
          selected={method}
          options={[{ label: 'Cash', value: 'cash' }, { label: 'Transfer', value: 'transfer' }]}
          onChange={(value) => setMethod(value)}
        />
        {method === 'cash'
          ? <div style={{ flex: 1, minHeight: 160 }}><CashForm key={formKey} onChange={setCashes} emptyText={null} /></div>
          : (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <span style={{ fontSize: 12, color: theme.text.tertiary }}>Amount received (USD)</span>
              <input
                type='number'
                min='0'
                step='any'
                value={transfer}
                onChange={(event) => setTransfer(event.target.value)}
                style={{ height: 36, padding: '0 10px', border: theme.border.quaternary, borderRadius: theme.radius.primary, background: 'transparent', color: theme.text.primary, fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
              />
            </label>
          )}

        <div style={{ padding: '10px 14px', borderRadius: theme.radius.secondary, backgroundColor: `${theme.color.info}0d` }}>
          {feeNow > 0 && line(`Fee now${feeType === 'PCT' ? ` (${feeValue}%)` : ''}`, currencyFormat(feeNow, 'USD'), false, theme.color.warning)}
          {feeNow > 0 && line('Owed with the fee', currencyFormat(due, 'USD'))}
          {line('Received', currencyFormat(received, 'USD'))}
          {line('Applied to the balance', currencyFormat(paid, 'USD'))}
          {transferTooMuch && line("A transfer can't be more than what's owed", '', false, theme.color.error)}
          {change > 0 && line('Change', <>{currencyFormat(change, 'USD')} ({currencyFormat(Math.round(change * sellRate), 'KHR')})</>, false, theme.color.warning)}
          {line(left > 0.005 ? 'Still owed after this' : 'Paid in full', currencyFormat(left, 'USD'), true, left > 0.005 ? undefined : theme.color.success)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
          <CustomButton styled={theme} onClick={onClose} disabled={saving} style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}>
            Cancel
          </CustomButton>
          <CustomButton styled={theme} isLoading={saving} onClick={handleCollect} style={{ backgroundColor: `${theme.color.success}22`, color: theme.color.success }}>
            Collect
          </CustomButton>
        </div>
      </div>
      </div>
    </AlertDialog>
  )
}
