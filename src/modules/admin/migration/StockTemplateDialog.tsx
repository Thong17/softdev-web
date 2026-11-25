import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Checkbox, CircularProgress, FormControlLabel } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Button from 'components/shared/Button'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { GridItem, GridLayout } from 'components/layouts/GridLayout'
import { QuantityStatus } from 'components/shared/QuantityStatus'
import { SelectField, TextField } from 'components/shared/form'
import { SelectTab } from 'components/shared/form/SelectTab'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'
import { convertBufferToArrayBuffer, currencyFormat, downloadBuffer } from 'utils'
import useLanguage from 'hooks/useLanguage'

type Status = 'all' | 'active' | 'inactive'
interface IOption { id: string, name: string }
interface IPickerProduct { id: string, name: string, picture: string, price: number, currency: string, status: boolean, inStock: number }

const PAGE = 60
// Whole days in this device's time zone
const dayStart = (day: string) => (day ? new Date(`${day}T00:00:00`).toISOString() : '')
const dayEnd = (day: string) => (day ? new Date(`${day}T23:59:59.999`).toISOString() : '')

// Stock › Download template: pick products for a prefilled template (filters
// above, "Select all" takes every match, not only the loaded cards), or
// download the empty one. Prefilled rows left without a cost or quantity are
// skipped on import.
export const StockTemplateDialog = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { notify } = useNotify()
  const [picked, setPicked] = useState<string[]>([])
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [brand, setBrand] = useState('all')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState<Status>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selectedOnly, setSelectedOnly] = useState(false)
  const [options, setOptions] = useState<{ brands: IOption[], categories: IOption[] }>({ brands: [], categories: [] })
  const [products, setProducts] = useState<IPickerProduct[]>([])
  const [matchIds, setMatchIds] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<'empty' | 'products' | null>(null)
  const request = useRef(0)
  const scroller = useRef<HTMLDivElement>(null)

  const pickedSet = useMemo(() => new Set(picked), [picked])
  const datesWrong = !!(from && to && from > to)
  // "Selected only" uses the selection as it was when switched on, so cards
  // don't vanish while being clicked
  const [onlyIds, setOnlyIds] = useState<string[] | null>(null)
  useEffect(() => { setOnlyIds(selectedOnly ? picked : null) }, [selectedOnly]) // eslint-disable-line react-hooks/exhaustive-deps
  // Nothing selected any more: the Selected tab is disabled, so go back to All
  useEffect(() => { if (!picked.length) setSelectedOnly(false) }, [picked.length])

  const filters = useMemo(() => ({
    search,
    brand,
    category,
    status,
    from: datesWrong ? '' : dayStart(from),
    to: datesWrong ? '' : dayEnd(to),
    ...(onlyIds ? { only: onlyIds } : {}),
  }), [search, brand, category, status, from, to, datesWrong, onlyIds])

  // Typing waits a moment before searching
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchText.trim()), 300)
    return () => clearTimeout(timer)
  }, [searchText])

  // Brands and categories, once per opening
  useEffect(() => {
    if (!open) return
    Axios({ method: 'GET', url: '/admin/migration/stock/template/options' })
      .then((response) => setOptions(response?.data?.data || { brands: [], categories: [] }))
      .catch((err) => notify(err?.response?.data?.msg || 'Failed to load brands and categories', 'error'))
  }, [open, notify])

  // A page of products; offset 0 starts over (filters changed). Only the
  // latest request's answer is used.
  const load = useCallback((offset: number) => {
    const id = ++request.current
    setLoading(true)
    if (offset === 0) setMatchIds(null)
    Axios({ method: 'POST', url: '/admin/migration/stock/template/products', body: { ...filters, offset, limit: PAGE } })
      .then((response) => {
        if (id !== request.current) return
        const page: IPickerProduct[] = response?.data?.data || []
        setProducts((prev) => (offset === 0 ? page : [...prev, ...page]))
        setMatchIds(response?.data?.ids || [])
      })
      .catch((err) => { if (id === request.current) notify(err?.response?.data?.msg || 'Failed to load products', 'error') })
      .finally(() => { if (id === request.current) setLoading(false) })
  }, [filters, notify])

  useEffect(() => {
    if (!open) return
    scroller.current?.scrollTo({ top: 0 })
    load(0)
  }, [open, load])

  // Next page when the last card scrolls into view
  const observer = useRef<IntersectionObserver | null>(null)
  const hasMore = matchIds !== null && products.length < matchIds.length
  const lastCard = useCallback((node: HTMLDivElement | null) => {
    observer.current?.disconnect()
    if (!node || loading || !hasMore) return
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) load(products.length)
    }, { root: scroller.current })
    observer.current.observe(node)
  }, [loading, hasMore, load, products.length])

  const matchedPicked = matchIds ? matchIds.filter((id) => pickedSet.has(id)).length : 0
  const allMatchedPicked = !!matchIds?.length && matchedPicked === matchIds.length

  const toggleProduct = (id: string) => setPicked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  const toggleAll = () => {
    if (!matchIds?.length) return
    if (allMatchedPicked) {
      const matched = new Set(matchIds)
      setPicked((prev) => prev.filter((id) => !matched.has(id)))
    } else {
      setPicked((prev) => Array.from(new Set([...prev, ...matchIds])))
    }
  }

  const filtersSet = !!(searchText || brand !== 'all' || category !== 'all' || status !== 'all' || from || to)
  const clearFilters = () => {
    setSearchText(''); setSearch(''); setBrand('all'); setCategory('all'); setStatus('all'); setFrom(''); setTo('')
  }

  const handleClose = () => {
    if (downloading) return
    onClose()
  }

  const download = (kind: 'empty' | 'products') => {
    if (kind === 'products' && !picked.length) return
    setDownloading(kind)
    const call = kind === 'empty'
      ? Axios({ method: 'GET', url: '/admin/migration/stock/template' })
      : Axios({ method: 'POST', url: '/admin/migration/stock/template', body: { ids: picked } })
    call
      .then((response) => {
        downloadBuffer(convertBufferToArrayBuffer(response?.data?.file?.data), response?.data?.name)
        // The next template starts from a fresh selection (closing without
        // downloading keeps it)
        if (kind === 'products') { setPicked([]); setSelectedOnly(false) }
        onClose()
      })
      .catch((err) => notify(err?.response?.data?.msg || 'Failed to download the template', 'error'))
      .finally(() => setDownloading(null))
  }

  const checkboxColor = (on: boolean) => ({ color: on ? theme.color.info : theme.text.quaternary })
  // Same look for both; a disabled one stays readable, only dimmed
  const checkLabel = { margin: 0, color: theme.text.secondary, '& .MuiFormControlLabel-label.Mui-disabled': { color: theme.text.tertiary, opacity: 0.7 } }

  return (
    <AlertDialog isOpen={open} handleClose={handleClose}>
      <DialogTitle title={language['DOWNLOAD_STOCK_TEMPLATE']} onClose={handleClose} />
      {/* Dialogs render outside the page, so the theme text colour is set here.
          The whole dialog is 80vh: this area is that minus the title bar. */}
      <div style={{ width: 'min(1100px, 94vw)', height: 'calc(80vh - 70px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', color: theme.text.primary }}>
        <div style={{ padding: '12px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          <TextField
            label={language['SEARCH']}
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            icon={<SearchRoundedIcon style={{ fontSize: 18 }} />}
          />
          <SelectField
            label={language['BRAND']}
            search
            value={brand}
            onChange={(event) => setBrand(event.target.value as string)}
            options={[{ value: 'all', label: language['ALL_BRANDS'] }, ...options.brands.map((item) => ({ value: item.id, label: item.name }))]}
          />
          <SelectField
            label={language['CATEGORY']}
            search
            value={category}
            onChange={(event) => setCategory(event.target.value as string)}
            options={[{ value: 'all', label: language['ALL_CATEGORIES'] }, ...options.categories.map((item) => ({ value: item.id, label: item.name }))]}
          />
          <SelectField
            label={language['STATUS']}
            value={status}
            onChange={(event) => setStatus(event.target.value as Status)}
            options={[
              { value: 'all', label: language['ALL_STATUS'] },
              { value: 'active', label: language['ACTIVE'] },
              { value: 'inactive', label: language['INACTIVE'] },
            ]}
          />
          <TextField type='date' label={language['ADDED_FROM']} value={from} onChange={(event) => setFrom(event.target.value)} err={datesWrong ? 'After "Added to"' : undefined} />
          <TextField type='date' label={language['ADDED_TO']} value={to} onChange={(event) => setTo(event.target.value)} />
        </div>

        <div style={{ padding: '2px 20px 6px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', minHeight: 42 }}>
          <SelectTab
            selected={selectedOnly ? 'selected' : 'all'}
            options={[
              { label: language['ALL_PRODUCTS'], value: 'all' },
              { label: `Selected (${picked.length})`, value: 'selected', disabled: !picked.length },
            ]}
            onChange={(value: string) => setSelectedOnly(value === 'selected')}
          />
          <span style={{ flex: 1 }} />
          {loading && <CircularProgress size={18} />}
          <FormControlLabel
            sx={checkLabel}
            label={matchIds === null ? 'Select all matching…' : `Select all ${matchIds.length} matching`}
            control={
              <Checkbox
                size='small'
                checked={allMatchedPicked}
                indeterminate={matchedPicked > 0 && !allMatchedPicked}
                disabled={!matchIds?.length}
                onChange={toggleAll}
                style={checkboxColor(matchedPicked > 0)}
              />
            }
          />
          {filtersSet && (
            <Button onClick={clearFilters} style={{ padding: '4px 12px', fontSize: 13, backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}>
              {language['CLEAR_FILTERS']}
            </Button>
          )}
        </div>

        {/* The cards scroll inside this area instead of spilling over the footer */}
        <div ref={scroller} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 20px 10px', borderTop: theme.border.quaternary }}>
          {matchIds !== null && !products.length ? (
            <div style={{ padding: 40, textAlign: 'center', color: theme.text.tertiary }}>{language['NO_PRODUCTS_MATCH_FILTERS']}</div>
          ) : (
            <GridLayout>
              {products.map((product, index) => (
                <GridItem
                  key={product.id}
                  ref={index === products.length - 1 ? lastCard : undefined}
                  id={product.id}
                  title={product.name}
                  picture={product.picture}
                  subLeft={currencyFormat(product.price, product.currency)}
                  subRight={<QuantityStatus qty={product.inStock} min={0} />}
                  status={product.status}
                  selected={pickedSet.has(product.id)}
                  onClick={() => toggleProduct(product.id)}
                />
              ))}
            </GridLayout>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '12px 20px', borderTop: theme.border.quaternary, backgroundColor: theme.background.primary, position: 'relative', zIndex: 1, flexShrink: 0, flexWrap: 'wrap' }}>
          <Button
            loading={downloading === 'empty'}
            disabled={!!downloading}
            onClick={() => download('empty')}
            style={{ backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}
          >
            {language['DOWNLOAD_EMPTY']}
          </Button>
          <Button
            loading={downloading === 'products'}
            disabled={!picked.length || !!downloading}
            onClick={() => download('products')}
            style={{ backgroundColor: `${theme.color.success}${picked.length ? '22' : '11'}`, color: theme.color.success }}
          >
            {language['DOWNLOAD_PRODUCTS']}
          </Button>
        </div>
      </div>
    </AlertDialog>
  )
}
