import { useRef, useState } from 'react'
import { Box } from '@mui/material'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Button from 'components/shared/Button'
import { HintBox } from 'components/shared/HintBox'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { TextHighlight } from 'components/shared/TextHighlight'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'
import { StockTemplateDialog } from './StockTemplateDialog'

// What the file says; sent back as-is to import (the server checks it again)
interface IStockInput {
  row: number
  barcode: string
  productNameEn: string
  cost: number | string
  currency: string
  quantity: number | string
  code: string
  expireAt: string
  alertAt: number | string
  newPrice: number | string
  newPriceCurrency: string
}

export interface IStockImportRow extends IStockInput {
  product: { id: string, name: string, matchedBy: 'barcode' | 'name', isStock: boolean } | null
  changesPrice: boolean
  errors: string[]
  warnings: string[]
}

type Column = 'row' | 'product' | 'cost' | 'quantity' | 'code' | 'expireAt' | 'alertAt' | 'newPrice' | 'problems' | 'action'
const columns: ITableColumn<Column>[] = [
  { id: 'row', label: 'Row', minWidth: 50 },
  { id: 'product', label: 'Product', minWidth: 200 },
  { id: 'cost', label: 'Cost', minWidth: 80 },
  { id: 'quantity', label: 'Quantity', minWidth: 70 },
  { id: 'code', label: 'Stock barcode', minWidth: 110 },
  { id: 'expireAt', label: 'Expire', minWidth: 95 },
  { id: 'alertAt', label: 'Alert at', minWidth: 65 },
  { id: 'newPrice', label: 'New price', minWidth: 90 },
  { id: 'problems', label: 'Problems', minWidth: 220 },
  { id: 'action', label: '', minWidth: 50, align: 'right' },
]

const shown = (value: number | string) => (value === '' || value === null || value === undefined ? '--' : String(value))
const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`
const inputsOf = ({ row, barcode, productNameEn, cost, currency, quantity, code, expireAt, alertAt, newPrice, newPriceCurrency }: IStockImportRow): IStockInput =>
  ({ row, barcode, productNameEn, cost, currency, quantity, code, expireAt, alertAt, newPrice, newPriceCurrency })

// Stock import from Excel: each row adds one stock batch to an existing product
export const StockImport = () => {
  const { theme } = useTheme()
  const { notify } = useNotify()
  const confirm = useAlert()
  const fileInput = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<IStockImportRow[]>([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = '' // the same file can be chosen again after editing it
    if (!file) return
    const formData = new FormData()
    formData.append('excel', file)
    setLoading(true)
    Axios({ method: 'POST', url: '/admin/migration/stock/preview', body: formData, headers: { 'content-type': 'multipart/form-data' } })
      .then((response) => {
        setRows(response?.data?.data || [])
        setFileName(file.name)
      })
      .catch((err) => notify(err?.response?.data?.msg || 'This file could not be read', 'error'))
      .finally(() => setLoading(false))
  }

  const removeRow = (row: number) => setRows((prev) => prev.filter((item) => item.row !== row))
  const removeErrorRows = () => setRows((prev) => prev.filter((item) => !item.errors.length))

  const errorCount = rows.filter((item) => item.errors.length).length
  const warningCount = rows.filter((item) => item.warnings.length).length
  const matched = rows.filter((item) => item.product)
  const productCount = new Set(matched.map((item) => item.product!.id)).size
  const stockTurnsOn = new Set(matched.filter((item) => !item.product!.isStock).map((item) => item.product!.id)).size
  const priceChanges = rows.filter((item) => item.changesPrice).length

  const handleImport = () => {
    if (!rows.length || errorCount) return
    const parts = [`This adds ${plural(rows.length, 'stock batch', 'stock batches')} to ${plural(productCount, 'product', 'products')}.`]
    if (stockTurnsOn) parts.push(`${plural(stockTurnsOn, 'product starts', 'products start')} tracking stock.`)
    if (priceChanges) parts.push(`${plural(priceChanges, 'price changes', 'prices change')}.`)
    if (warningCount) parts.push(`${plural(warningCount, 'row has a warning', 'rows have warnings')}; they will still be imported.`)
    confirm({ title: 'Import stock?', description: parts.join(' '), variant: 'info' })
      .then(() => {
        setLoading(true)
        // Only what the file says: the server matches and checks every row again
        Axios({ method: 'POST', url: '/admin/migration/stock/import', body: { rows: rows.map(inputsOf) } })
          .then((response) => {
            notify(response?.data?.msg, 'success')
            setRows([])
            setFileName('')
          })
          .catch((err) => {
            notify(err?.response?.data?.msg || 'Import failed', 'error')
            // Checked again on the server: show what it found (e.g. a product deleted meanwhile)
            if (Array.isArray(err?.response?.data?.data)) setRows(err.response.data.data)
          })
          .finally(() => setLoading(false))
      })
      .catch(() => {})
  }

  const productCell = (item: IStockImportRow) => {
    const typed = item.productNameEn || item.barcode
    if (!item.product) return typed ? <span style={{ color: theme.text.tertiary }}>{typed}</span> : '--'
    return (
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span>{item.product.name}</span>
        <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <TextHighlight text={item.product.matchedBy === 'barcode' ? `Barcode ${item.barcode}` : 'By name'} color={theme.text.tertiary} size={11} />
          {!item.product.isStock && <TextHighlight text='Stock turns on' color={theme.color.info} size={11} />}
        </span>
      </span>
    )
  }

  const tableRows = rows.map((item) => ({
    id: item.row,
    _dataId: item.errors.length ? 'error' : item.warnings.length ? 'warning' : undefined,
    row: item.row,
    product: productCell(item),
    cost: item.cost === '' ? '--' : `${item.cost} ${item.currency}`,
    quantity: shown(item.quantity),
    code: shown(item.code),
    expireAt: shown(item.expireAt),
    alertAt: shown(item.alertAt),
    newPrice: item.newPrice === '' ? '--' : (
      <span style={{ color: item.changesPrice ? theme.text.primary : theme.text.tertiary }}>{item.newPrice} {item.newPriceCurrency}</span>
    ),
    problems: (item.errors.length || item.warnings.length) ? (
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, whiteSpace: 'normal' }}>
        {item.errors.map((message) => <span key={message} style={{ color: theme.color.error }}>{message}</span>)}
        {item.warnings.map((message) => <span key={message} style={{ color: theme.color.warning }}>{message}</span>)}
      </span>
    ) : '--',
    action: (
      <Button
        onClick={() => removeRow(item.row)}
        style={{ minWidth: 0, padding: 6, backgroundColor: `${theme.color.error}18`, color: theme.color.error }}
        aria-label={`Remove row ${item.row}`}
      >
        <CloseRoundedIcon style={{ fontSize: 16 }} />
      </Button>
    ),
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <HintBox>
        Download a template (empty, or listing all, filtered or chosen products), fill COST and QUANTITY for the products you are adding stock to, and choose it here. Rows left without them are skipped. Each row finds its product by BARCODE, or by English name when the barcode is empty or unknown, and adds a new batch, like Add Stock does. STOCK_BARCODE is optional: that batch's own barcode (e.g. a lot label), not the product's BARCODE. Products that don't track stock yet start tracking it. A new price is optional and needs permission to change prices. Rows in red can't be imported: no product or more than one matches, or a value is wrong. Remove them (or fix the file and choose it again), then Import.
      </HintBox>
      <StockTemplateDialog open={templateOpen} onClose={() => setTemplateOpen(false)} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button onClick={() => setTemplateOpen(true)} style={{ backgroundColor: `${theme.color.success}22`, color: theme.color.success }}>
          <FileDownloadRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
          Download template
        </Button>
        <input ref={fileInput} type='file' accept='.xlsx,.xls' onChange={handleFile} style={{ display: 'none' }} />
        <Button loading={loading && !rows.length} onClick={() => fileInput.current?.click()} style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}>
          <UploadFileRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
          Choose Excel file
        </Button>
        {fileName && <span style={{ color: theme.text.tertiary, fontSize: 13 }}>{fileName}</span>}
      </div>

      {rows.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ flex: 1, minWidth: 220, color: theme.text.secondary, fontSize: 14 }}>
              {plural(rows.length, 'row', 'rows')} · {plural(productCount, 'product', 'products')}
              {errorCount > 0 && <span style={{ color: theme.color.error }}> · {errorCount} with errors</span>}
              {warningCount > 0 && <span style={{ color: theme.color.warning }}> · {warningCount} with warnings</span>}
              {stockTurnsOn > 0 && <> · stock turns on for {plural(stockTurnsOn, 'product', 'products')}</>}
              {priceChanges > 0 && <> · {plural(priceChanges, 'price change', 'price changes')}</>}
            </span>
            {errorCount > 0 && (
              <Button onClick={removeErrorRows} style={{ backgroundColor: `${theme.color.error}18`, color: theme.color.error }}>
                Remove {errorCount} red row{errorCount === 1 ? '' : 's'}
              </Button>
            )}
            <Button
              onClick={() => { setRows([]); setFileName('') }}
              style={{ backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}
            >
              Clear
            </Button>
            <Button
              loading={loading}
              disabled={errorCount > 0}
              onClick={handleImport}
              style={{ backgroundColor: `${theme.color.info}${errorCount ? '11' : '22'}`, color: theme.color.info }}
            >
              Import {rows.length}
            </Button>
          </div>
          <Box
            sx={{
              '& tr[data-id="error"] td': { backgroundColor: theme.color.error + '11' },
              '& tr[data-id="warning"] td': { backgroundColor: theme.color.warning + '0d' },
            }}
          >
            <StickyTable columns={columns} rows={tableRows} pagination={false} />
          </Box>
        </>
      )}
    </div>
  )
}
