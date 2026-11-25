import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded'
import { OnlineImageDialog } from './OnlineImageDialog'
import Button from 'components/shared/Button'
import { HintBox } from 'components/shared/HintBox'
import { SelectTab } from 'components/shared/form/SelectTab'
import { StickyTable, ITableColumn } from 'components/shared/table/StickyTable'
import { TextHighlight } from 'components/shared/TextHighlight'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'
import useLanguage from 'hooks/useLanguage'

type Target = 'product' | 'brand' | 'category'
type Status = 'will-set' | 'has-picture' | 'no-match' | 'ambiguous' | 'duplicate-file' | 'too-big' | 'set' | 'failed'

interface IImageRow {
  file: File
  url: string
  status: Status
  name?: string
  // Product picked by hand when the file name didn't match
  chosenId?: string
}

const CHUNK = 20 // images per upload request (the server takes at most 20)
const MAX_SIZE = 5 * 1024 * 1024
const labels: Record<Target, { one: string, many: string }> = {
  product: { one: 'product', many: 'products' },
  brand: { one: 'brand', many: 'brands' },
  category: { one: 'category', many: 'categories' },
}

type Column = 'picture' | 'file' | 'match' | 'status'
const columns: ITableColumn<Column>[] = [
  { id: 'picture', label: '', minWidth: 60 },
  { id: 'file', label: 'File', minWidth: 180 },
  { id: 'match', label: 'Matches', minWidth: 180 },
  { id: 'status', label: 'Result', minWidth: 160 },
]

// Bulk pictures: each file's name (without extension) is the English name of
// the product / brand / category it belongs to. Only missing pictures are set.
export const ImageImport = () => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { notify } = useNotify()
  const confirm = useAlert()
  const fileInput = useRef<HTMLInputElement>(null)
  const [target, setTarget] = useState<Target>('product')
  const [rows, setRows] = useState<IImageRow[]>([])
  const [checking, setChecking] = useState(false)
  // Find online (Pexels): available once the API has a key
  const [onlineOpen, setOnlineOpen] = useState(false)
  const [onlineEnabled, setOnlineEnabled] = useState<boolean | null>(null)
  useEffect(() => {
    Axios({ method: 'GET', url: '/admin/migration/online/status' })
      .then((response) => setOnlineEnabled(!!response?.data?.data?.enabled))
      .catch(() => setOnlineEnabled(false))
  }, [])
  const openOnline = () => {
    if (!onlineEnabled) return notify('Photo search is not set up: add PEXELS_API_KEY to the API settings (free key at pexels.com/api) and restart the API', 'warning')
    setOnlineOpen(true)
  }
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })

  const statusView: Record<Status, { text: string, color?: string }> = {
    'will-set': { text: language['WILL_BE_SET'], color: theme.color.info },
    'has-picture': { text: language['ALREADY_HAS_PICTURE'], color: theme.text.tertiary },
    'no-match': { text: language['NO_MATCH'], color: theme.color.error },
    'ambiguous': { text: language['NAME_USED_MORE_THAN_ONCE'], color: theme.color.warning },
    'duplicate-file': { text: language['SAME_NAME_AS_ANOTHER_FILE'], color: theme.color.warning },
    'too-big': { text: language['LARGER_THAN_5MB'], color: theme.color.error },
    'set': { text: language['SET'], color: theme.color.success },
    'failed': { text: language['UPLOAD_FAILED'], color: theme.color.error },
  }

  // Thumbnails are object URLs: freed when another set of files replaces them
  // or on leaving the page (not on every row update, which keeps them)
  const urls = useRef<string[]>([])
  const freeUrls = () => {
    urls.current.forEach((url) => URL.revokeObjectURL(url))
    urls.current = []
  }
  useEffect(() => freeUrls, [])

  const clear = () => {
    freeUrls()
    setRows([])
    setProgress({ done: 0, total: 0 })
  }

  // Asks the server what each file would do (by its name, or by the product
  // picked for it) and updates the rows, keeping their thumbnails
  const rematch = (current: IImageRow[], forTarget: Target) => {
    if (!current.length) return
    setChecking(true)
    Axios({
      method: 'POST',
      url: '/admin/migration/image/preview',
      body: { target: forTarget, names: current.map((row) => row.file.name), ids: current.map((row) => row.chosenId || '') },
    })
      .then((response) => {
        const results = response?.data?.data || []
        setRows(current.map((row, index) => ({
          ...row,
          status: (row.file.size > MAX_SIZE ? 'too-big' : results[index]?.status || 'no-match') as Status,
          name: results[index]?.name,
        })))
        setProgress({ done: 0, total: 0 })
      })
      .catch((err) => notify(err?.response?.data?.msg || 'Could not check the images', 'error'))
      .finally(() => setChecking(false))
  }

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return
    freeUrls()
    const next: IImageRow[] = files.map((file) => ({ file, url: URL.createObjectURL(file), status: 'no-match' }))
    urls.current = next.map((row) => row.url)
    setRows(next)
    rematch(next, target)
  }

  // Switching what the images are for checks the same files again; picked
  // products don't carry over to brands or categories
  const handleTarget = (value: Target) => {
    setTarget(value)
    if (rows.length) rematch(rows.map((row) => ({ ...row, chosenId: undefined })), value)
  }

  // Picking a product for a file whose name didn't match
  const [picking, setPicking] = useState<number | null>(null)
  const handlePickProduct = (productId: string) => {
    if (picking === null) return
    const next = rows.map((row, index) => (index === picking ? { ...row, chosenId: productId } : row))
    setPicking(null)
    rematch(next, target)
  }
  const canPick = (row: IImageRow) => target === 'product' && !uploading && !['set', 'too-big'].includes(row.status)
    && (!!row.chosenId || ['no-match', 'ambiguous', 'duplicate-file'].includes(row.status))

  const toSet = rows.filter((row) => row.status === 'will-set')
  const count = (status: Status) => rows.filter((row) => row.status === status).length

  const handleUpload = () => {
    if (!toSet.length) return
    const skipped = rows.length - toSet.length
    confirm({
      title: 'Set pictures?',
      description: `Set pictures for ${toSet.length} ${toSet.length === 1 ? labels[target].one : labels[target].many}.${skipped ? ` ${skipped} file${skipped === 1 ? ' is' : 's are'} skipped (no match, already has a picture, or a repeated name).` : ''}`,
      variant: 'info',
    })
      .then(async () => {
        setUploading(true)
        setProgress({ done: 0, total: toSet.length })
        const outcome = new Map<File, { status: Status, name?: string }>()
        for (let i = 0; i < toSet.length; i += CHUNK) {
          const chunk = toSet.slice(i, i + CHUNK)
          const formData = new FormData()
          formData.append('target', target)
          chunk.forEach((row) => formData.append('files', row.file))
          // The picked product for each file, in the same order ('' = by name)
          formData.append('ids', JSON.stringify(chunk.map((row) => row.chosenId || '')))
          try {
            const response = await Axios({ method: 'POST', url: '/admin/migration/image/upload', body: formData, headers: { 'content-type': 'multipart/form-data' } })
            const results = response?.data?.data || []
            chunk.forEach((row, index) => outcome.set(row.file, { status: results[index]?.status || 'failed', name: results[index]?.name || row.name }))
          } catch (err: any) {
            chunk.forEach((row) => outcome.set(row.file, { status: 'failed', name: err?.response?.data?.msg || row.name }))
          }
          setProgress({ done: Math.min(i + CHUNK, toSet.length), total: toSet.length })
          setRows((prev) => prev.map((row) => (outcome.has(row.file) ? { ...row, ...outcome.get(row.file) } : row)))
        }
        const setCount = Array.from(outcome.values()).filter((result) => result.status === 'set').length
        notify(`${setCount} picture${setCount === 1 ? '' : 's'} set`, setCount === toSet.length ? 'success' : 'warning')
        setUploading(false)
      })
      .catch(() => {})
  }

  const tableRows = rows.map((row, index) => ({
    id: index,
    _dataId: ['no-match', 'failed', 'too-big'].includes(row.status) ? 'error' : ['ambiguous', 'duplicate-file'].includes(row.status) ? 'warning' : undefined,
    picture: <img src={row.url} alt='' style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: theme.radius.primary, display: 'block' }} />,
    file: row.file.name,
    match: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span>
          {row.name || '--'}
          {row.chosenId && row.name && <span style={{ color: theme.text.tertiary, fontSize: 12 }}> · picked</span>}
        </span>
        {canPick(row) && (
          <Button
            disabled={checking}
            onClick={() => setPicking(index)}
            style={{ padding: '3px 10px', fontSize: 12, backgroundColor: `${theme.color.info}18`, color: theme.color.info }}
          >
            {row.chosenId ? language['EDIT'] : language['CHOOSE_PRODUCT']}
          </Button>
        )}
      </span>
    ),
    status: <TextHighlight text={statusView[row.status].text} color={statusView[row.status].color} size={12} />,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <HintBox>
        Name each image after the English name of what it belongs to, e.g. "Ballpoint Pen Blue 0.5mm.jpg" (letter case and extra spaces don't matter). Only missing pictures are set; existing ones are never replaced. Up to 5 MB per image. Names containing / \ : * ? " &lt; &gt; | can't be used as file names, so set those pictures by hand.
      </HintBox>
      <SelectTab
        selected={target}
        options={[
          { label: language['PRODUCTS'], value: 'product' },
          { label: language['BRANDS'], value: 'brand' },
          { label: language['CATEGORIES'], value: 'category' },
        ]}
        onChange={handleTarget}
      />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input ref={fileInput} type='file' accept='image/*' multiple onChange={handleFiles} style={{ display: 'none' }} />
        <Button loading={checking} disabled={uploading} onClick={() => fileInput.current?.click()} style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info }}>
          <AddPhotoAlternateRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
          {language['CHOOSE_IMAGES']}
        </Button>
        {target === 'product' && (
          <Button
            disabled={uploading || onlineEnabled === null}
            onClick={openOnline}
            title={onlineEnabled === false ? 'Needs PEXELS_API_KEY in the API settings' : 'Search Pexels for product photos'}
            style={{ backgroundColor: `${theme.color.success}${onlineEnabled === false ? '11' : '22'}`, color: theme.color.success }}
          >
            <TravelExploreRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
            {language['FIND_ONLINE']}
          </Button>
        )}
        {rows.length > 0 && (
          <>
            <span style={{ flex: 1, minWidth: 220, color: theme.text.secondary, fontSize: 14 }}>
              {rows.length} file{rows.length === 1 ? '' : 's'} · {count('will-set')} to set
              {count('has-picture') > 0 && <> · {count('has-picture')} already have one</>}
              {count('no-match') > 0 && <span style={{ color: theme.color.error }}> · {count('no-match')} no match</span>}
              {count('set') > 0 && <span style={{ color: theme.color.success }}> · {count('set')} set</span>}
              {uploading && <> · uploading {progress.done} / {progress.total}</>}
            </span>
            <Button disabled={uploading} onClick={clear} style={{ backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}>
              {language['CLEAR']}
            </Button>
            <Button
              loading={uploading}
              disabled={!toSet.length}
              onClick={handleUpload}
              style={{ backgroundColor: `${theme.color.info}${toSet.length ? '22' : '11'}`, color: theme.color.info }}
            >
              <CloudUploadRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
              Set {toSet.length} picture{toSet.length === 1 ? '' : 's'}
            </Button>
          </>
        )}
      </div>
      {rows.length > 0 && (
        <Box
          sx={{
            '& tr[data-id="error"] td': { backgroundColor: theme.color.error + '11' },
            '& tr[data-id="warning"] td': { backgroundColor: theme.color.warning + '0d' },
          }}
        >
          <StickyTable columns={columns} rows={tableRows} pagination={false} />
        </Box>
      )}

      <OnlineImageDialog open={onlineOpen} onClose={() => setOnlineOpen(false)} />

      {/* Product list (search and filters) to pick the product an image is for */}
      <AlertDialog isOpen={picking !== null} handleClose={() => setPicking(null)}>
        <DialogTitle title={language['CHOOSE_PRODUCT_FOR_IMAGE']} onClose={() => setPicking(null)} />
        {picking !== null && rows[picking] && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px 0 20px', color: theme.text.secondary, fontSize: 14 }}>
            <img src={rows[picking].url} alt='' style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: theme.radius.primary }} />
            <span>{rows[picking].file.name}</span>
          </div>
        )}
        {/* Dialogs render outside the page, so the page's theme text colour
            (Layout) isn't inherited; set it here for the list's own text */}
        <div style={{ width: 'min(1100px, 92vw)', height: '70vh', padding: '10px 20px 20px 20px', boxSizing: 'border-box', overflowY: 'auto', color: theme.text.primary }}>
          <ProductContainer onClickProduct={handlePickProduct} />
        </div>
      </AlertDialog>
    </div>
  )
}
