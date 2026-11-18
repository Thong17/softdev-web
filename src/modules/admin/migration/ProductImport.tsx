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
import { convertBufferToArrayBuffer, downloadBuffer } from 'utils'

interface ILink {
  status: 'existing' | 'new' | 'none' | 'unclear'
  id?: string
  name?: string
}

export interface IImportRow {
  row: number
  productNameEn: string
  productNameKh: string
  brandNameEn: string
  brandNameKh: string
  categoryNameEn: string
  categoryNameKh: string
  price: number | string
  currency: string
  isStock: boolean | string
  status: boolean | string
  barcode: string
  description: string
  brand: ILink
  category: ILink
  errors: string[]
  warnings: string[]
}

type Column = 'row' | 'product' | 'brand' | 'category' | 'price' | 'isStock' | 'status' | 'barcode' | 'problems' | 'action'
const columns: ITableColumn<Column>[] = [
  { id: 'row', label: 'Row', minWidth: 50 },
  { id: 'product', label: 'Product', minWidth: 180 },
  { id: 'brand', label: 'Brand', minWidth: 120 },
  { id: 'category', label: 'Category', minWidth: 120 },
  { id: 'price', label: 'Price', minWidth: 80 },
  { id: 'isStock', label: 'Stock', minWidth: 60 },
  { id: 'status', label: 'Active', minWidth: 60 },
  { id: 'barcode', label: 'Barcode', minWidth: 110 },
  { id: 'problems', label: 'Problems', minWidth: 220 },
  { id: 'action', label: '', minWidth: 50, align: 'right' },
]

const yesNo = (value: boolean | string) => (value === true ? 'Yes' : value === false ? 'No' : String(value || '--'))

// Product import from Excel: preview every row, remove the red ones, confirm
export const ProductImport = () => {
  const { theme } = useTheme()
  const { notify } = useNotify()
  const confirm = useAlert()
  const fileInput = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<IImportRow[]>([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleTemplate = () => {
    setDownloading(true)
    Axios({ method: 'GET', url: '/admin/migration/product/template' })
      .then((response) => downloadBuffer(convertBufferToArrayBuffer(response?.data?.file?.data), response?.data?.name))
      .catch((err) => notify(err?.response?.data?.msg || 'Failed to download the template', 'error'))
      .finally(() => setDownloading(false))
  }

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = '' // the same file can be chosen again after editing it
    if (!file) return
    const formData = new FormData()
    formData.append('excel', file)
    setLoading(true)
    Axios({ method: 'POST', url: '/admin/migration/product/preview', body: formData, headers: { 'content-type': 'multipart/form-data' } })
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
  const newNames = (field: 'brand' | 'category') => new Set(rows.filter((item) => item[field].status === 'new').map((item) => (item[field].name || '').toLowerCase())).size
  const newBrands = newNames('brand')
  const newCategories = newNames('category')

  const handleImport = () => {
    if (!rows.length || errorCount) return
    const parts = [`${rows.length} product${rows.length === 1 ? '' : 's'}`]
    if (newBrands) parts.push(`${newBrands} new brand${newBrands === 1 ? '' : 's'}`)
    if (newCategories) parts.push(`${newCategories} new categor${newCategories === 1 ? 'y' : 'ies'}`)
    confirm({
      title: 'Import products?',
      description: `This creates ${parts.join(', ')}.${warningCount ? ` ${warningCount} row${warningCount === 1 ? ' has a warning' : 's have warnings'} (barcode already used); they will still be imported.` : ''}`,
      variant: 'info',
    })
      .then(() => {
        setLoading(true)
        Axios({ method: 'POST', url: '/admin/migration/product/import', body: { rows } })
          .then((response) => {
            notify(response?.data?.msg, 'success')
            setRows([])
            setFileName('')
          })
          .catch((err) => {
            notify(err?.response?.data?.msg || 'Import failed', 'error')
            // Checked again on the server: show what it found (e.g. a name added meanwhile)
            if (Array.isArray(err?.response?.data?.data)) setRows(err.response.data.data)
          })
          .finally(() => setLoading(false))
      })
      .catch(() => {})
  }

  const linkCell = (nameEn: string, nameKh: string, link: ILink) => {
    if (!nameEn) return '--'
    return (
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span>{nameEn}{nameKh ? <span style={{ color: theme.text.tertiary }}> · {nameKh}</span> : null}</span>
        {link.status === 'new' && <TextHighlight text='New' color={theme.color.info} size={11} />}
      </span>
    )
  }

  const tableRows = rows.map((item) => ({
    id: item.row,
    _dataId: item.errors.length ? 'error' : item.warnings.length ? 'warning' : undefined,
    row: item.row,
    product: (
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{item.productNameEn || '--'}</span>
        {item.productNameKh && <span style={{ color: theme.text.tertiary, fontSize: 12 }}>{item.productNameKh}</span>}
      </span>
    ),
    brand: linkCell(item.brandNameEn, item.brandNameKh, item.brand),
    category: linkCell(item.categoryNameEn, item.categoryNameKh, item.category),
    price: item.price === '' ? '--' : `${item.price} ${item.currency}`,
    isStock: yesNo(item.isStock),
    status: yesNo(item.status),
    barcode: item.barcode || '--',
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
        Fill the template (one product per row) and choose it here. Brands and categories are matched by English name and created when new. Rows in red can't be imported: a product with that English name already exists, it repeats an earlier row, or a value is wrong. Remove them (or fix the file and choose it again), then Import.
      </HintBox>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button loading={downloading} onClick={handleTemplate} style={{ backgroundColor: `${theme.color.success}22`, color: theme.color.success }}>
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
              {rows.length} row{rows.length === 1 ? '' : 's'}
              {errorCount > 0 && <span style={{ color: theme.color.error }}> · {errorCount} with errors</span>}
              {warningCount > 0 && <span style={{ color: theme.color.warning }}> · {warningCount} with warnings</span>}
              {newBrands > 0 && <> · {newBrands} new brand{newBrands === 1 ? '' : 's'}</>}
              {newCategories > 0 && <> · {newCategories} new categor{newCategories === 1 ? 'y' : 'ies'}</>}
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
