import { useEffect, useState } from 'react'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import { currencyFormat, timeFormat } from 'utils'

declare type ColumnHeader = 'order' | 'variant' | 'code' | 'quantity' | 'cost' | 'margin' | 'expireAt' | 'createdAt'

const columnData: ITableColumn<ColumnHeader>[] = [
  { id: 'order', label: 'Order', minWidth: 90 },
  { id: 'variant', label: 'Variant', minWidth: 100 },
  { id: 'code', label: 'Code', minWidth: 80 },
  { id: 'quantity', label: 'In Stock', minWidth: 70 },
  { id: 'cost', label: 'Cost', minWidth: 80 },
  { id: 'margin', label: 'Margin', minWidth: 90 },
  { id: 'expireAt', label: 'Expire At', minWidth: 90 },
  { id: 'createdAt', label: 'Added At', minWidth: 110 },
]

// Shows the selling price against the cost of every batch still in stock, with
// the batch the next sale takes from highlighted. Only for roles with
// product.viewCost (the API enforces it too).
export const StockCostDialog = ({ productId, onClose }: { productId: string | null, onClose: () => void }) => {
  const { theme } = useTheme()
  const { width } = useWeb()
  const { user } = useAuth()
  const { lang } = useLanguage()
  const { notify } = useNotify()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const rate = user?.drawer?.buyRate || 4000

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    setData(null)
    Axios({ method: 'GET', url: `/shared/product/stock-cost/${productId}` })
      .then((response) => setData(response?.data?.data))
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const nameOf = (item) => item?.name?.[lang] || item?.name?.['English'] || (typeof item?.name === 'string' ? item.name : '')
  const toUSD = (value, currency) => (currency === 'KHR' ? value / rate : value) || 0
  const product = data?.product
  const priceUSD = toUSD(product?.price, product?.currency)

  const chip = (label, color) => (
    <span style={{ padding: '3px 10px', borderRadius: theme.radius.primary, backgroundColor: `${color}22`, color, fontSize: 13, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )

  const marginOf = (stock) => {
    const costUSD = toUSD(stock.cost, stock.currency)
    const margin = priceUSD - costUSD
    const percent = costUSD ? (margin / costUSD) * 100 : 0
    const color = margin < 0 ? theme.color.error : theme.color.success
    return (
      <span style={{ color, whiteSpace: 'nowrap' }}>
        {currencyFormat(margin, 'USD')}{costUSD ? ` (${percent.toFixed(0)}%)` : ''}
      </span>
    )
  }

  const stocks = data?.stocks || []
  const rows = stocks.map((stock, index) => ({
    id: stock._id,
    order: stock.nextOut ? chip('Next out', theme.color.info) : `#${index + 1}`,
    variant: [nameOf(stock.color), ...(stock.options || []).map(nameOf)].filter(Boolean).join(', ') || '--',
    code: stock.code || '--',
    quantity: stock.quantity,
    cost: <b>{currencyFormat(stock.cost, stock.currency)}</b>,
    margin: marginOf(stock),
    expireAt: stock.expireAt ? timeFormat(stock.expireAt, 'YYYY-MM-DD') : '--',
    createdAt: timeFormat(stock.createdAt, 'YYYY-MM-DD HH:mm'),
  }))

  const next = stocks.find((stock) => stock.nextOut)
  const summary = (label, value) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <span style={{ color: theme.text.tertiary, fontSize: 12 }}>{label}</span>
      <span style={{ color: theme.text.primary, fontSize: 16 }}>{value}</span>
    </div>
  )

  return (
    <AlertDialog isOpen={!!productId} handleClose={onClose}>
      <DialogTitle title={`Stock Cost${product ? ` · ${nameOf(product)}` : ''}`} onClose={onClose} />
      <div style={{ width: width < 1024 ? '92vw' : '60vw', maxWidth: 1000, padding: '0 20px 20px 20px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', padding: '5px 0 15px 0' }}>
          {summary('Selling price', product ? currencyFormat(product.price, product.currency) : '--')}
          {summary('Next out cost', next ? currencyFormat(next.cost, next.currency) : '--')}
          {summary('Next out margin', next ? marginOf(next) : '--')}
          {summary('In stock', stocks.reduce((total, stock) => total + stock.quantity, 0))}
        </div>
        <StickyTable columns={columnData} rows={rows} loading={loading} pagination={false} />
        {!loading && stocks.length === 0 && (
          <div style={{ color: theme.text.tertiary, textAlign: 'center', padding: 20 }}>No stock left</div>
        )}
      </div>
    </AlertDialog>
  )
}
