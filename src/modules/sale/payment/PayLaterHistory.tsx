import { useEffect, useState } from 'react'
import { CustomButton } from 'styles'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { currencyFormat, timeFormat } from 'utils'
import { CollectDialog } from './CollectDialog'

declare type Column = 'paidAt' | 'kind' | 'method' | 'amount' | 'by'

const columns: ITableColumn<Column>[] = [
  { id: 'paidAt', label: 'Date', minWidth: 120 },
  { id: 'kind', label: 'Type', minWidth: 90 },
  { id: 'method', label: 'Method', minWidth: 80 },
  { id: 'amount', label: 'Amount', minWidth: 90, align: 'right' },
  { id: 'by', label: 'By', minWidth: 80 },
]

// A Pay Later sale's balance and every payment received, with Collect
export const PayLaterHistory = ({ paymentId, onChange }: { paymentId?: string | null, onChange?: () => void }) => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [payment, setPayment] = useState<any>(null)
  const [rows, setRows] = useState<any[]>([])
  const [collecting, setCollecting] = useState(false)

  const load = () => {
    if (!paymentId) return
    Axios({ method: 'GET', url: `/sale/payment/detail/${paymentId}` })
      .then((response) => setPayment(response?.data?.data))
      .catch(() => setPayment(null))
    Axios({ method: 'GET', url: `/sale/payment/installments/${paymentId}` })
      .then((response) => setRows(response?.data?.data || []))
      .catch(() => setRows([]))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId])

  if (!payment?.isPayLater) return null

  const owed = Number(payment.balance?.USD) || 0
  const fee = payment.payLater?.fee?.amount || 0
  const due = payment.payLater?.dueDate
  const overdue = owed > 0.005 && due && new Date(due) < new Date()
  const stat = (label: string, value: any, color?: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 12, color: theme.text.tertiary }}>{label}</span>
      <span style={{ fontSize: 16, color: color || theme.text.primary }}>{value}</span>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, marginBottom: 16, borderRadius: theme.radius.secondary, border: theme.border.quaternary }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 16, color: theme.text.primary }}>Pay Later</span>
        {owed > 0.005 && user?.privilege?.payment?.update && (
          <CustomButton styled={theme} onClick={() => setCollecting(true)} style={{ backgroundColor: `${theme.color.success}22`, color: theme.color.success }}>
            Collect
          </CustomButton>
        )}
      </div>
      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
        {stat('Sale total', currencyFormat(payment.total?.value, payment.total?.currency))}
        {fee > 0 && stat(`Fee${payment.payLater?.fee?.type === 'PCT' ? ` (${payment.payLater.fee.value}%)` : ''}`, currencyFormat(fee, 'USD'))}
        {stat('Paid', currencyFormat(payment.paidTotal || 0, 'USD'), theme.color.success)}
        {stat('Balance', owed > 0.005 ? currencyFormat(owed, 'USD') : 'Paid in full', owed > 0.005 ? theme.color.warning : theme.color.success)}
        {due && stat('Due', `${timeFormat(due, 'YYYY-MM-DD')}${overdue ? ' · overdue' : ''}`, overdue ? theme.color.error : undefined)}
      </div>
      {payment.payLater?.note && <div style={{ fontSize: 13, color: theme.text.secondary }}>Note: {payment.payLater.note}</div>}
      {rows.length > 0
        ? (
          <StickyTable
            columns={columns}
            pagination={false}
            rows={rows.map((row) => ({
              id: row._id,
              paidAt: timeFormat(row.paidAt, 'YYYY-MM-DD HH:mm'),
              kind: row.kind === 'DEPOSIT' ? 'Deposit' : row.groupPayment ? 'Group payment' : 'Payment',
              method: row.paymentMethod === 'transfer' ? 'Transfer' : 'Cash',
              amount: currencyFormat(row.amount, 'USD'),
              by: row.createdBy?.username || '--',
            }))}
          />
        )
        : <span style={{ fontSize: 13, color: theme.text.tertiary }}>Nothing received yet.</span>}
      <CollectDialog
        payment={collecting ? payment : null}
        onClose={() => setCollecting(false)}
        onCollected={() => {
          load()
          onChange?.()
        }}
      />
    </div>
  )
}
