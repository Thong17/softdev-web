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
// amount up to what's owed; extra cash is given back as change.
export const CollectDialog = ({ payment, onClose, onCollected }: { payment: any | null, onClose: () => void, onCollected: () => void }) => {
  const { theme } = useTheme()
  const { width } = useWeb()
  const { user } = useAuth()
  const { notify } = useNotify()
  const [method, setMethod] = useState<'cash' | 'transfer'>('cash')
  const [cashes, setCashes] = useState<any[]>([])
  const [transfer, setTransfer] = useState('')
  const [saving, setSaving] = useState(false)
  // CashForm keeps its own list; a new key starts it empty
  const [formKey, setFormKey] = useState(0)
  const sellRate = user?.drawer?.sellRate || payment?.rate?.sellRate || 4000
  const owed = Number(payment?.balance?.USD) || 0

  useEffect(() => {
    setMethod('cash')
    setCashes([])
    setTransfer(owed ? owed.toFixed(2) : '')
    setFormKey((key) => key + 1)
  }, [payment?._id, owed])

  const cashUSD = cashes.reduce((sum, cash) => sum + (cash.currency === 'USD' ? cash.value * cash.quantity : 0), 0)
  const cashKHR = cashes.reduce((sum, cash) => sum + (cash.currency === 'KHR' ? cash.value * cash.quantity : 0), 0)
  const received = method === 'cash' ? cashUSD + cashKHR / sellRate : Number(transfer) || 0
  const paid = Math.min(received, owed)
  // Only cash gives change; a transfer can't be more than what's owed
  const change = method === 'cash' ? Math.max(0, received - owed) : 0
  const transferTooMuch = method === 'transfer' && received > owed + 0.01
  const left = Math.max(0, owed - received)

  const handleCollect = () => {
    if (received <= 0) return notify('Enter the amount received', 'error')
    if (transferTooMuch) return notify("A transfer can't be more than what's owed", 'error')
    if (!user?.drawer) return notify('Open drawer first!', 'error')
    setSaving(true)
    Axios({
      method: 'POST',
      url: `/sale/payment/collect/${payment._id}`,
      body: method === 'cash'
        ? { paymentMethod: 'cash', receiveCashes: cashes, receiveTotal: { USD: cashUSD, KHR: cashKHR, total: received } }
        : { paymentMethod: 'transfer', receiveCashes: [], receiveTotal: { USD: received, KHR: 0, total: received } },
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

  const fee = payment?.payLater?.fee?.amount || 0
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
