import { useEffect, useMemo, useRef, useState } from 'react'
import { IconButton } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import { currencyFormat, debounce, timeFormat } from 'utils'

declare type Column = 'date' | 'invoice' | 'product' | 'customer' | 'quantity' | 'price' | 'discount' | 'total'

interface IProductPick {
  _id: string
  name: string
}

const nowrap = (value) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>

// What a customer paid for each product they bought, or what every customer
// paid for one product. One row per item on a completed sale, newest first.
// From Cashing / Quotation, the search suggests the products in the current
// cart; picking one filters the history to that product.
interface IPriceHistoryProps {
  // { _id, name } of the customer or product to show; shown while one is set
  customer?: { _id: string, name?: string } | null
  product?: { _id: string, name?: string } | null
  // Products in the cart this was opened from (Cashing / Quotation)
  cartProducts?: IProductPick[]
}

// The search and table, without a dialog (also used as a tab elsewhere)
export const PriceHistoryPanel = ({ customer, product, cartProducts = [] }: IPriceHistoryProps) => {
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const { notify } = useNotify()
  const [rows, setRows] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState({ page: 0, limit: 10, search: '' })
  const [text, setText] = useState('')
  const [picked, setPicked] = useState<IProductPick | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  // Latest text, so a delayed search is dropped once the text has changed
  const textRef = useRef('')
  textRef.current = text
  const open = !!(customer || product)
  const byCustomer = !!customer

  const nameOf = (item) => item?.name?.[lang] || item?.name?.English || (typeof item?.name === 'string' ? item.name : '') || item?.description || ''

  // A fresh start each time the dialog opens for someone else
  useEffect(() => {
    if (!open) return
    setQuery({ page: 0, limit: 10, search: '' })
    setText('')
    setPicked(null)
    setMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, customer?._id, product?._id])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    const productId = product?._id || picked?._id
    const params = new URLSearchParams({
      ...(customer && { customer: customer._id }),
      ...(productId && { product: productId }),
      page: String(query.page),
      limit: String(query.limit),
      ...(query.search && { search: query.search }),
    })
    Axios({ method: 'GET', url: '/organize/customer/price-history', params })
      .then((response) => {
        setRows(response?.data?.data || [])
        setCount(response?.data?.length || 0)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, customer?._id, product?._id, picked?._id, query])

  // Suggestions: the cart's products (once each), filtered by what's typed
  const groups = useMemo(() => {
    const term = text.trim().toLowerCase()
    const seen = new Set<string>()
    const cart = cartProducts.filter((item) => {
      if (!item._id || seen.has(item._id)) return false
      seen.add(item._id)
      return !term || item.name.toLowerCase().includes(term)
    })
    return cart.length ? [{ key: 'cart', label: 'In cart', icon: <ShoppingCartRoundedIcon style={{ fontSize: 15 }} />, items: cart }] : []
  }, [cartProducts, text])
  const flat = groups.flatMap((group) => group.items)

  // Results follow the text shortly after typing stops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchLater = useMemo(() => debounce((value: string) => {
    if (textRef.current.trim() !== value) return
    setQuery((prev) => (prev.search === value ? prev : { ...prev, search: value, page: 0 }))
  }, 350), [])

  const pickProduct = (item: IProductPick) => {
    setPicked(item)
    setText('')
    setMenuOpen(false)
    setQuery((prev) => ({ ...prev, search: '', page: 0 }))
  }

  const clearPick = () => {
    setPicked(null)
    setQuery((prev) => ({ ...prev, page: 0 }))
    inputRef.current?.focus()
  }

  // Enter: the highlighted cart product, or search right away
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' && flat.length) {
      event.preventDefault()
      setMenuOpen(true)
      setActive((prev) => Math.min(prev + 1, flat.length - 1))
    } else if (event.key === 'ArrowUp' && flat.length) {
      event.preventDefault()
      setActive((prev) => Math.max(prev - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      // The list only shows products matching the text, so a highlighted one is
      // what was meant; with no match (e.g. an invoice number) it's a search
      if (menuOpen && flat[active]) return pickProduct(flat[active])
      setMenuOpen(false)
      setQuery((prev) => ({ ...prev, search: text.trim(), page: 0 }))
    } else if (event.key === 'Escape') {
      setMenuOpen(false)
    } else if (event.key === 'Backspace' && !text && picked) {
      clearPick()
    }
  }

  const columns: ITableColumn<Column>[] = [
    { id: 'date', label: 'Date', minWidth: 110 },
    { id: 'invoice', label: 'Invoice', minWidth: 90 },
    byCustomer ? { id: 'product', label: 'Product', minWidth: 140 } : { id: 'customer', label: 'Customer', minWidth: 140 },
    { id: 'quantity', label: 'Qty', minWidth: 50, align: 'right' },
    { id: 'price', label: 'Unit Price', minWidth: 85, align: 'right' },
    { id: 'discount', label: 'Discount', minWidth: 75, align: 'right' },
    { id: 'total', label: 'Total', minWidth: 85, align: 'right' },
  ]

  const discountOf = (discount) => {
    if (!discount?.value) return '--'
    return discount.type === 'PCT' ? `${discount.value}%` : currencyFormat(discount.value, discount.type)
  }

  const tableRows = rows.map((row) => ({
    id: row._id,
    date: nowrap(timeFormat(row.date, 'YYYY-MM-DD HH:mm')),
    invoice: nowrap(row.invoice || '--'),
    product: nameOf(row.product) || row.description || '--',
    customer: (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{row.customer?.fullName || row.customer?.companyName || row.customer?.displayName || '--'}</span>
        {row.customer?.fullName && <span style={{ fontSize: 12, color: theme.text.tertiary }}>{row.customer.displayName}</span>}
      </div>
    ),
    quantity: row.quantity,
    price: <b>{nowrap(currencyFormat(row.price, row.currency))}</b>,
    discount: nowrap(discountOf(row.discount)),
    total: nowrap(currencyFormat(row.total?.value, row.total?.currency)),
  }))

  const emptyText = picked
    ? `${customer?.name || 'This customer'} hasn't bought ${picked.name} before`
    : query.search ? 'Nothing matches that search'
    : byCustomer ? 'This customer has no completed purchases yet' : 'No customer has bought this product yet'

  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => inputRef.current?.focus()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 38,
              padding: '0 6px 0 10px',
              boxSizing: 'border-box',
              border: theme.border.quaternary,
              borderRadius: theme.radius.primary,
              cursor: 'text',
            }}
          >
            <SearchRoundedIcon style={{ fontSize: 18, color: theme.text.tertiary }} />
            {picked && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '2px 4px 2px 10px', borderRadius: theme.radius.primary, backgroundColor: `${theme.color.info}22`, color: theme.color.info, fontSize: 13, whiteSpace: 'nowrap', maxWidth: '50%', overflow: 'hidden' }}>
                {picked.name}
                <IconButton size='small' onClick={(event) => { event.stopPropagation(); clearPick() }} style={{ color: theme.color.info, width: 20, height: 20 }}>
                  <CloseRoundedIcon style={{ fontSize: 14 }} />
                </IconButton>
              </span>
            )}
            <input
              ref={inputRef}
              type='text'
              value={text}
              placeholder={byCustomer
                ? (picked ? 'Search invoice' : cartProducts.length ? 'Pick a cart product or search' : 'Search product or invoice')
                : 'Search customer or invoice'}
              onFocus={() => byCustomer && setMenuOpen(true)}
              onBlur={() => setMenuOpen(false)}
              onChange={(event) => {
                setText(event.target.value)
                setActive(0)
                if (byCustomer) setMenuOpen(true)
                searchLater(event.target.value.trim())
              }}
              onKeyDown={handleKeyDown}
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: theme.text.primary, fontFamily: 'inherit', fontSize: 14 }}
            />
          </div>
          {byCustomer && menuOpen && groups.length > 0 && (
            <div
              // Keep focus in the input so a click picks before the menu closes
              onMouseDown={(event) => event.preventDefault()}
              style={{
                position: 'absolute',
                top: 42,
                left: 0,
                right: 0,
                zIndex: 10,
                maxHeight: 280,
                overflowY: 'auto',
                backgroundColor: theme.background.primary,
                border: theme.border.quaternary,
                borderRadius: theme.radius.primary,
                boxShadow: theme.shadow.secondary,
                padding: '4px 0',
              }}
            >
              {groups.map((group) => (
                <div key={group.key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px 4px 12px', fontSize: 12, color: theme.text.tertiary }}>
                    {group.icon}
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const index = flat.indexOf(item)
                    return (
                      <div
                        key={`${group.key}-${item._id}`}
                        role='option'
                        aria-selected={index === active}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => pickProduct(item)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 10,
                          padding: '7px 12px 7px 32px',
                          fontSize: 14,
                          cursor: 'pointer',
                          color: theme.text.secondary,
                          backgroundColor: index === active ? `${theme.text.secondary}14` : 'transparent',
                        }}
                      >
                        <span>{item.name}</span>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* The table's loading overlay fills its nearest positioned parent;
            keep it to the table so the search box (and any dialog tabs) stay put */}
        <div style={{ position: 'relative', minHeight: 120 }}>
          <StickyTable
            columns={columns}
            rows={tableRows}
            loading={loading}
            count={count}
            limit={query.limit}
            skip={query.page}
            setQuery={(data) => setQuery((prev) => ({ ...prev, ...(data.limit ? { limit: data.limit, page: 0 } : { page: data.page }) }))}
          />
        </div>
        {!loading && !rows.length && (
          <div style={{ color: theme.text.tertiary, textAlign: 'center', padding: 10 }}>{emptyText}</div>
        )}
      </div>
  )
}

export const PriceHistoryDialog = ({ onClose, ...props }: IPriceHistoryProps & { onClose: () => void }) => {
  const { width } = useWeb()
  const open = !!(props.customer || props.product)
  const subject = props.customer?.name || props.product?.name
  return (
    <AlertDialog isOpen={open} handleClose={onClose}>
      <DialogTitle title={`Price History${subject ? ` · ${subject}` : ''}`} onClose={onClose} />
      <div style={{ width: width < 1024 ? '92vw' : '70vw', maxWidth: 1100, padding: '0 20px 10px 20px', boxSizing: 'border-box' }}>
        <PriceHistoryPanel {...props} />
      </div>
    </AlertDialog>
  )
}
