import { forwardRef } from 'react'
import { currencyFormat, timeFormat } from 'utils'
import { PaperSize, paperHeightPx, paperWidthPx } from 'utils/pdf'

// Labels print in Khmer and English
const L = {
  invoice: 'វិក្កយបត្រ / INVOICE',
  number: 'លេខ / No.',
  date: 'កាលបរិច្ឆេទ / Date',
  cashier: 'អ្នកគិតលុយ / Cashier',
  billTo: 'អតិថិជន / Bill to',
  walkIn: 'អតិថិជនទូទៅ / Walk-in customer',
  company: 'ក្រុមហ៊ុន / Company',
  contactPerson: 'អ្នកទំនាក់ទំនង / Contact',
  phone: 'ទូរស័ព្ទ / Phone',
  taxId: 'លេខ VATTIN / Tax ID',
  address: 'អាសយដ្ឋាន / Address',
  no: 'ល.រ / No',
  description: 'បរិយាយ / Description',
  qty: 'ចំនួន / Qty',
  unitPrice: 'តម្លៃរាយ / Unit Price',
  discount: 'បញ្ចុះតម្លៃ / Discount',
  amount: 'ទឹកប្រាក់ / Amount',
  subtotal: 'សរុបរង / Subtotal',
  invoiceDiscount: 'បញ្ចុះតម្លៃ / Discount',
  tax: 'ពន្ធ / Tax',
  voucher: 'ប័ណ្ណ / Voucher',
  total: 'សរុប / Total',
  totalKhr: 'សរុបជារៀល / Total (KHR)',
  rate: 'អត្រាប្តូរប្រាក់ / Exchange rate',
  method: 'វិធីបង់ប្រាក់ / Payment',
  received: 'ប្រាក់ទទួល / Received',
  change: 'ប្រាក់អាប់ / Change',
  balance: 'នៅខ្វះ / Balance due',
  paid: 'បានបង់ / PAID',
  unpaid: 'មិនទាន់បង់ / UNPAID',
  loan: 'បង់រំលោះ / LOAN',
  saleTotal: 'សរុបវិក្កយបត្រ / Sale total',
  thanks: 'សូមអរគុណ / Thank you',
}

const methodLabel = {
  cash: 'សាច់ប្រាក់ / Cash',
  transfer: 'ផ្ទេរប្រាក់ / Transfer',
  loan: 'បង់រំលោះ / Loan',
  later: 'បង់ពេលក្រោយ / Pay later',
}

const nameOf = (item) => item?.name?.English || item?.name?.Khmer || (typeof item?.name === 'string' ? item.name : '') || ''
// currencyFormat returns an element, so these are combined as JSX, never in
// template strings
const promotion = (value) => {
  if (!value?.value) return null
  return value.type === 'PCT' ? `${value.value}%` : currencyFormat(value.value, value.type)
}
const toUSD = (value, currency, rate) => (currency === 'KHR' ? (Number(value) || 0) / (rate?.sellRate || rate?.buyRate || 4000) : Number(value) || 0)

// Paid, unpaid or loan, from how the sale was settled
const paymentState = (payment) => {
  if (payment?.paymentMethod === 'loan') return 'loan'
  if (!payment?.status || payment?.paymentMethod === 'later' || payment?.state === 'PENDING') return 'unpaid'
  return 'paid'
}

export interface IInvoiceData {
  store: any
  setting: { showLogo?: boolean, footer?: string }
  // One sale, or a group payment with its sales
  payment?: any
  group?: any
  payments?: any[]
}

// A4 / A5 invoice for one sale or a group payment. Rendered as HTML so it can
// be printed by the browser or captured into a PDF.
export const InvoiceDocument = forwardRef(({ data, paperSize = 'A4' }: { data: IInvoiceData, paperSize?: PaperSize }, ref: any) => {
  const small = paperSize === 'A5'
  const fs = small ? 10 : 12
  const { store, setting } = data
  const sales = data.group ? (data.payments || []) : [data.payment].filter(Boolean)
  const head = data.group || data.payment || {}
  const customer = sales.find((sale) => sale?.customer)?.customer
  const rate = head.rate || sales[0]?.rate
  const state = paymentState(data.group ? { ...head, status: head.status ?? true } : head)
  const stamp = { paid: { text: L.paid, color: '#2e7d32' }, unpaid: { text: L.unpaid, color: '#c62828' }, loan: { text: L.loan, color: '#ef6c00' } }[state]

  const cell = { padding: small ? '5px 6px' : '7px 9px', borderBottom: '1px solid #e3e3e3', verticalAlign: 'top' as const }
  const right = { ...cell, textAlign: 'right' as const, whiteSpace: 'nowrap' as const }
  const center = { ...cell, textAlign: 'center' as const }

  // One sale: invoice-level adjustments; a group: each sale's own total
  const [discount] = data.payment?.discounts || []
  const [tax] = data.payment?.services || []
  const [voucher] = data.payment?.vouchers || []
  const totalUSD = toUSD(head.total?.value, head.total?.currency, rate)
  const totalKHR = Math.round(totalUSD * (rate?.sellRate || 4000))
  const received = head.receiveTotal?.total
  const remain = head.remainTotal?.USD

  let lineNo = 0
  const row = (item) => {
    lineNo += 1
    const extras = [nameOf(item.color), ...(item.options || []).map((option) => `${nameOf(option.property) ? `${nameOf(option.property)}: ` : ''}${nameOf(option)}`)].filter(Boolean).join(', ')
    return (
      <tr key={item._id}>
        <td style={center}>{lineNo}</td>
        <td style={cell}>
          {item.description || nameOf(item.product)}
          {item.product?.code && <span style={{ color: '#888888' }}> · {item.product.code}</span>}
          {extras && <div style={{ color: '#777777', fontSize: fs - 1 }}>{extras}</div>}
          {item.note && <div style={{ color: '#777777', fontSize: fs - 1 }}>{item.note}</div>}
        </td>
        <td style={center}>{item.quantity}</td>
        <td style={right}>{currencyFormat(item.price, item.currency)}</td>
        <td style={right}>{promotion(item.discount) ?? '-'}</td>
        <td style={right}>{currencyFormat(item.total?.value, item.total?.currency)}</td>
      </tr>
    )
  }

  const summary = (label, value, bold = false) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: small ? '3px 0' : '4px 0', fontWeight: bold ? 'bold' : 'normal' }}>
      <span style={{ color: bold ? '#222222' : '#666666' }}>{label}</span>
      <span style={{ whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )

  const detailLine = (label, value) => value ? (
    <div style={{ display: 'flex', gap: 6 }}>
      <span style={{ color: '#777777', whiteSpace: 'nowrap' }}>{label}:</span>
      <span>{value}</span>
    </div>
  ) : null

  return (
    <div
      ref={ref}
      style={{
        width: paperWidthPx[paperSize],
        minHeight: paperHeightPx[paperSize],
        padding: small ? 28 : 44,
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#222222',
        fontFamily: `'Hanuman', Arial, sans-serif`,
        fontSize: fs,
        lineHeight: 1.45,
        position: 'relative',
      }}
    >
      {/* Store and invoice header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {setting?.showLogo !== false && store?.logo?.filename && (
            <img
              src={`${process.env.REACT_APP_API_UPLOADS}${store.logo.filename}`}
              alt='logo'
              crossOrigin='anonymous'
              style={{ width: small ? 48 : 64, height: small ? 48 : 64, objectFit: 'contain' }}
            />
          )}
          <div>
            <div style={{ fontSize: small ? 15 : 19, fontWeight: 'bold' }}>{store?.name}</div>
            {store?.address && <div style={{ color: '#666666' }}>{store.address}</div>}
            {store?.contact && <div style={{ color: '#666666' }}>{store.contact}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: small ? 15 : 20, fontWeight: 'bold', letterSpacing: 1 }}>{L.invoice}</div>
          <div style={{ marginTop: 4 }}>{L.number} <b>{head.invoice}</b></div>
          <div>{L.date} {timeFormat(head.createdAt, 'YYYY-MM-DD HH:mm')}</div>
          {head.createdBy?.username && <div>{L.cashier} {head.createdBy.username}</div>}
        </div>
      </div>

      {/* Customer */}
      <div style={{ marginTop: small ? 14 : 22, padding: small ? 10 : 14, backgroundColor: '#f6f6f6', borderRadius: 6, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#777777', marginBottom: 2 }}>{L.billTo}</div>
          {customer ? (
            <>
              <div style={{ fontWeight: 'bold', fontSize: fs + 1 }}>{customer.companyName || customer.fullName || customer.displayName}</div>
              {customer.companyName && detailLine(L.contactPerson, customer.contactPerson || customer.fullName)}
              {detailLine(L.phone, [customer.displayName, customer.contact].filter(Boolean).join(' / '))}
              {detailLine(L.address, customer.address)}
            </>
          ) : (
            <div style={{ fontWeight: 'bold' }}>{L.walkIn}</div>
          )}
        </div>
        {customer?.taxId && <div style={{ textAlign: 'right' }}>{detailLine(L.taxId, customer.taxId)}</div>}
      </div>

      {/* Items */}
      <table style={{ width: '100%', marginTop: small ? 12 : 18, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#222222', color: '#ffffff' }}>
            <th style={{ ...center, width: small ? 44 : 56, borderBottom: 'none', whiteSpace: 'nowrap' }}>{L.no}</th>
            <th style={{ ...cell, textAlign: 'left', borderBottom: 'none' }}>{L.description}</th>
            <th style={{ ...center, width: small ? 44 : 56, borderBottom: 'none', whiteSpace: 'nowrap' }}>{L.qty}</th>
            <th style={{ ...right, borderBottom: 'none' }}>{L.unitPrice}</th>
            <th style={{ ...right, borderBottom: 'none' }}>{L.discount}</th>
            <th style={{ ...right, borderBottom: 'none' }}>{L.amount}</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            data.group ? [
              <tr key={`${sale._id}-head`}>
                <td colSpan={6} style={{ ...cell, backgroundColor: '#fafafa', color: '#555555', fontWeight: 'bold' }}>
                  {sale.invoice} · {timeFormat(sale.createdAt, 'YYYY-MM-DD')}
                </td>
              </tr>,
              ...(sale.transactions || []).map(row),
              <tr key={`${sale._id}-total`}>
                <td colSpan={5} style={{ ...right, color: '#666666' }}>{L.saleTotal}</td>
                <td style={right}>{currencyFormat(sale.total?.value, sale.total?.currency)}</td>
              </tr>,
            ] : (sale.transactions || []).map(row)
          ))}
        </tbody>
      </table>

      {/* Totals and payment */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginTop: small ? 10 : 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Paid / Unpaid / Loan stamp */}
          <div style={{ display: 'inline-block', marginTop: 6, padding: small ? '4px 10px' : '6px 14px', border: `2px solid ${stamp.color}`, color: stamp.color, borderRadius: 6, fontWeight: 'bold', fontSize: fs + 2, transform: 'rotate(-4deg)' }}>
            {stamp.text}
          </div>
          <div style={{ marginTop: 10 }}>
            {detailLine(L.method, methodLabel[head.paymentMethod] || head.paymentMethod)}
            {state === 'paid' && received ? detailLine(L.received, currencyFormat(received, 'USD')) : null}
            {state === 'paid' && remain < 0 ? detailLine(L.change, <>{currencyFormat(-remain, 'USD')} ({currencyFormat(Math.round(-(head.remainTotal?.KHR || 0)), 'KHR')})</>) : null}
            {state !== 'paid' && remain > 0 ? detailLine(L.balance, currencyFormat(remain, 'USD')) : null}
          </div>
        </div>
        <div style={{ width: small ? 220 : 290 }}>
          {summary(L.subtotal, currencyFormat(head.subtotal?.BOTH ?? totalUSD, 'USD'))}
          {!!discount?.value && summary(L.invoiceDiscount, <>-{promotion(discount)}</>)}
          {!!tax?.value && summary(L.tax, <>+{promotion(tax)}</>)}
          {!!voucher?.value && summary(L.voucher, <>-{promotion(voucher)}</>)}
          <div style={{ borderTop: '2px solid #222222', marginTop: 6, paddingTop: 4, fontSize: fs + 2 }}>
            {summary(L.total, currencyFormat(head.total?.value, head.total?.currency || 'USD'), true)}
          </div>
          {summary(L.totalKhr, currencyFormat(totalKHR, 'KHR'))}
          {rate?.sellRate && summary(L.rate, `1 USD = ${Number(rate.sellRate).toLocaleString()} KHR`)}
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: small ? 18 : 30, borderTop: '1px solid #e3e3e3', paddingTop: 10, textAlign: 'center', color: '#666666', whiteSpace: 'pre-wrap' }}>
        {setting?.footer || store?.other}
        <div style={{ marginTop: 4, fontWeight: 'bold', color: '#444444' }}>{L.thanks}</div>
      </div>
    </div>
  )
})
