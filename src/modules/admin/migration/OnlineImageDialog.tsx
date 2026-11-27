import { useState } from 'react'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import { CameraDialog } from 'components/shared/dialog/CameraDialog'
import Button from 'components/shared/Button'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import { TextHighlight } from 'components/shared/TextHighlight'
import Axios from 'constants/functions/Axios'
import useTheme from 'hooks/useTheme'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'

interface ICandidate {
  id: number
  thumb: string
  alt: string
  photographer: string
  photographerUrl: string
  pageUrl: string
  // A photo taken with the camera (not from Pexels): uploaded on save
  file?: File
}

interface IOnlineProduct {
  id: string
  name: string
  brand: string
  picture: string | null
  query: string
  page: number
  photos: ICandidate[]
  hasMore: boolean
  searching: boolean
  error?: string
  picked?: ICandidate
  skipped?: boolean
  result?: { status: 'set' | 'failed', msg?: string }
}

const SAVE_CHUNK = 10 // photos per save request (the server takes at most 10)

// Find online: choose products, then for each one pick a Pexels photo, take
// one with the camera, or skip. Picked photos become the product's picture;
// an existing picture is kept in its extra images. Without a Pexels key
// (searchEnabled false) only the camera is offered.
export const OnlineImageDialog = ({ open, onClose, searchEnabled = true }: { open: boolean, onClose: () => void, searchEnabled?: boolean }) => {
  const { theme } = useTheme()
  const { notify } = useNotify()
  const confirm = useAlert()
  const [step, setStep] = useState<'select' | 'pick'>('select')
  const [selected, setSelected] = useState<string[]>([])
  const [products, setProducts] = useState<IOnlineProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  // The product the camera is taking a photo for
  const [cameraFor, setCameraFor] = useState<string | null>(null)
  // Kept after closing, so the title doesn't empty while the dialog fades out
  const [cameraName, setCameraName] = useState('')

  const update = (id: string, patch: Partial<IOnlineProduct>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...patch } : product)))
  }

  const reset = () => {
    // Previews of camera photos
    products.forEach((product) => product.photos.forEach((photo) => photo.file && URL.revokeObjectURL(photo.thumb)))
    setStep('select')
    setSelected([])
    setProducts([])
  }

  const unsaved = products.filter((product) => product.picked && product.result?.status !== 'set').length
  const handleClose = () => {
    if (saving) return
    if (!unsaved) {
      reset()
      return onClose()
    }
    confirm({ title: 'Discard picked photos?', description: `${unsaved} picked photo${unsaved === 1 ? ' is' : 's are'} not saved yet.`, variant: 'warning' })
      .then(() => { reset(); onClose() })
      .catch(() => {})
  }

  const toggleProduct = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // One product's search; `more` loads the next page under the current photos
  const searchFor = async (product: IOnlineProduct, more = false) => {
    const query = product.query.trim()
    if (!query) return
    const page = more ? product.page + 1 : 1
    update(product.id, { searching: true, error: undefined })
    try {
      const response = await Axios({ method: 'POST', url: '/admin/migration/online/search', body: { query, page } })
      const data = response?.data?.data || { photos: [], hasMore: false }
      setProducts((prev) => prev.map((item) => (item.id === product.id
        // Photos taken with the camera stay first; a new search replaces the rest
        ? { ...item, page, hasMore: data.hasMore, searching: false, photos: more ? [...item.photos, ...data.photos] : [...item.photos.filter((photo) => photo.file), ...data.photos] }
        : item)))
    } catch (err: any) {
      update(product.id, { searching: false, error: err?.response?.data?.msg || 'Search failed' })
    }
  }

  const handleNext = async () => {
    if (!selected.length) return
    setLoading(true)
    try {
      const response = await Axios({ method: 'POST', url: '/admin/migration/online/products', body: { ids: selected } })
      // Products already reviewed (after Back) keep their search and pick
      const kept = new Map(products.map((product) => [product.id, product]))
      const list: IOnlineProduct[] = (response?.data?.data || []).map((product) => kept.get(product.id) || {
        ...product,
        query: product.name,
        page: 1,
        photos: [],
        hasMore: false,
        searching: searchEnabled,
      })
      setProducts(list)
      setStep('pick')
      // One search at a time, to stay well inside Pexels' hourly limit
      if (searchEnabled) {
        for (const product of list) {
          if (!kept.has(product.id)) await searchFor(product)
        }
      }
    } catch (err: any) {
      notify(err?.response?.data?.msg || 'Could not load the products', 'error')
    } finally {
      setLoading(false)
    }
  }

  // The product a photo is already picked for, if any (one photo, one product)
  const pickedFor = (photoId: number, exceptId: string) => products.find((product) => product.id !== exceptId && product.picked?.id === photoId)

  const pick = (product: IOnlineProduct, photo: ICandidate) => {
    if (product.result?.status === 'set') return
    if (product.picked?.id === photo.id) return update(product.id, { picked: undefined })
    if (pickedFor(photo.id, product.id)) return
    update(product.id, { picked: photo, skipped: false })
  }

  // A camera photo goes first in the product's photos, already picked
  const handleCapture = (file: File) => {
    const id = cameraFor
    setCameraFor(null)
    if (!id) return
    const photo: ICandidate = { id: -Date.now(), thumb: URL.createObjectURL(file), alt: '', photographer: '', photographerUrl: '', pageUrl: '', file }
    setProducts((prev) => prev.map((product) => (product.id === id
      ? { ...product, photos: [photo, ...product.photos], picked: photo, skipped: false }
      : product)))
  }

  const toSave = products.filter((product) => product.picked && !product.skipped && product.result?.status !== 'set')

  const handleSave = () => {
    if (!toSave.length) return
    const replacing = toSave.filter((product) => product.picture).length
    confirm({
      title: 'Save pictures?',
      description: `Save ${toSave.length} photo${toSave.length === 1 ? '' : 's'} as product pictures.${replacing ? ` ${replacing} replace${replacing === 1 ? 's an existing picture' : ' existing pictures'}; the old one stays in the product's extra images.` : ''}`,
      variant: 'info',
    })
      .then(async () => {
        setSaving(true)
        const outcomes: { productId: string, status: 'set' | 'failed', msg?: string }[] = []
        const showResults = () => {
          // Results show on each product as each request finishes
          const done = new Map(outcomes.map((outcome) => [outcome.productId, outcome]))
          setProducts((prev) => prev.map((product) => {
            const outcome = done.get(product.id)
            return outcome ? { ...product, result: { status: outcome.status, msg: outcome.msg } } : product
          }))
        }
        // Camera photos: uploaded one at a time
        for (const product of toSave.filter((item) => item.picked?.file)) {
          const body = new FormData()
          body.append('productId', product.id)
          body.append('file', product.picked!.file!)
          try {
            await Axios({ method: 'POST', url: '/admin/migration/online/photo', body, headers: { 'content-type': 'multipart/form-data' } })
            outcomes.push({ productId: product.id, status: 'set' })
          } catch (err: any) {
            outcomes.push({ productId: product.id, status: 'failed', msg: err?.response?.data?.msg || 'Save failed' })
          }
          showResults()
        }
        // Pexels photos: downloaded on the server, a few per request
        const fromPexels = toSave.filter((item) => !item.picked?.file)
        for (let i = 0; i < fromPexels.length; i += SAVE_CHUNK) {
          const chunk = fromPexels.slice(i, i + SAVE_CHUNK)
          try {
            const response = await Axios({
              method: 'POST',
              url: '/admin/migration/online/save',
              body: { items: chunk.map((product) => ({ productId: product.id, photoId: product.picked?.id })) },
            })
            outcomes.push(...(response?.data?.data || []))
          } catch (err: any) {
            const msg = err?.response?.data?.msg || 'Save failed'
            outcomes.push(...chunk.map((product) => ({ productId: product.id, status: 'failed' as const, msg })))
          }
          showResults()
        }
        const set = outcomes.filter((outcome) => outcome.status === 'set').length
        setSaving(false)
        if (set === toSave.length) {
          // All saved: done, close the dialog
          notify(`${set} picture${set === 1 ? '' : 's'} saved`, 'success')
          reset()
          onClose()
          return
        }
        // Some failed: stay open so the reasons show and they can be retried
        notify(`${set} of ${toSave.length} pictures saved; see the failed ones`, 'warning')
      })
      .catch(() => {})
  }

  const input = {
    flex: 1,
    minWidth: 0,
    height: 34,
    padding: '0 12px',
    border: theme.border.quaternary,
    borderRadius: theme.radius.primary,
    background: 'transparent',
    color: theme.text.primary,
    fontFamily: 'inherit',
    fontSize: 14,
    outline: 'none',
  }

  const productBlock = (product: IOnlineProduct) => {
    const done = product.result?.status === 'set'
    return (
      <div
        key={product.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 14,
          border: product.picked && !product.skipped ? `1px solid ${theme.color.info}66` : theme.border.quaternary,
          borderRadius: theme.radius.secondary,
          opacity: product.skipped ? 0.5 : 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {product.picture
            ? <img src={`${process.env.REACT_APP_API_UPLOADS}${product.picture}`} alt='' style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: theme.radius.primary }} />
            : <span style={{ width: 48, height: 48, borderRadius: theme.radius.primary, border: theme.border.quaternary, display: 'grid', placeItems: 'center', fontSize: 10, color: theme.text.tertiary, textAlign: 'center' }}>No picture</span>}
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 15 }}>{product.name}</span>
            {product.brand && <span style={{ display: 'block', fontSize: 12, color: theme.text.tertiary }}>{product.brand}</span>}
          </span>
          {product.result && (
            <TextHighlight
              text={done ? 'Saved' : `Failed${product.result.msg ? `: ${product.result.msg}` : ''}`}
              color={done ? theme.color.success : theme.color.error}
              size={12}
            />
          )}
          {!done && !product.skipped && (
            <Button
              disabled={saving}
              onClick={() => { setCameraName(product.name); setCameraFor(product.id) }}
              style={{ padding: '4px 12px', fontSize: 13, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
            >
              <PhotoCameraRoundedIcon style={{ fontSize: 16, marginRight: 4 }} />
              Take photo
            </Button>
          )}
          {!done && (
            <Button
              disabled={saving}
              onClick={() => update(product.id, { skipped: !product.skipped, picked: undefined })}
              style={{ padding: '4px 12px', fontSize: 13, backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}
            >
              {product.skipped ? 'Undo skip' : 'Skip'}
            </Button>
          )}
        </div>

        {!product.skipped && !done && (
          <>
            {searchEnabled && <form
              onSubmit={(event) => { event.preventDefault(); searchFor(product) }}
              style={{ display: 'flex', gap: 8 }}
            >
              <input
                value={product.query}
                onChange={(event) => update(product.id, { query: event.target.value })}
                placeholder='Search text'
                style={input}
              />
              <Button type='submit' loading={product.searching} style={{ padding: '4px 12px', backgroundColor: `${theme.color.info}22`, color: theme.color.info }}>
                <SearchRoundedIcon style={{ fontSize: 18 }} />
              </Button>
            </form>}
            {product.error && <span style={{ color: theme.color.error, fontSize: 13 }}>{product.error}</span>}
            {searchEnabled && !product.searching && !product.error && !product.photos.length && (
              <span style={{ color: theme.text.tertiary, fontSize: 13 }}>No photos found. Try other words, e.g. what the item is ("notebook", "stapler").</span>
            )}
            {product.photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                {product.photos.map((photo) => {
                  const isPicked = product.picked?.id === photo.id
                  const usedBy = pickedFor(photo.id, product.id)
                  return (
                    <div key={photo.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <button
                        type='button'
                        disabled={!!usedBy || saving}
                        onClick={() => pick(product, photo)}
                        title={photo.alt || undefined}
                        style={{
                          position: 'relative',
                          padding: 0,
                          height: 100,
                          border: isPicked ? `3px solid ${theme.color.info}` : '3px solid transparent',
                          borderRadius: theme.radius.secondary,
                          overflow: 'hidden',
                          cursor: usedBy ? 'not-allowed' : 'pointer',
                          background: 'none',
                        }}
                      >
                        <img src={photo.thumb} alt={photo.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: usedBy ? 0.35 : 1 }} />
                        {usedBy && (
                          <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 6, fontSize: 11, color: '#fff', background: '#0008' }}>
                            Used for {usedBy.name}
                          </span>
                        )}
                      </button>
                      {photo.file ? (
                        <span style={{ fontSize: 11, color: theme.text.tertiary }}>Your photo</span>
                      ) : (
                        <a href={photo.pageUrl} target='_blank' rel='noopener noreferrer' style={{ fontSize: 11, color: theme.text.tertiary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Photo: {photo.photographer}
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {product.hasMore && (
              <Button
                loading={product.searching}
                onClick={() => searchFor(product, true)}
                style={{ alignSelf: 'start', padding: '4px 12px', fontSize: 13, backgroundColor: `${theme.color.info}18`, color: theme.color.info }}
              >
                More photos
              </Button>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <AlertDialog isOpen={open} handleClose={handleClose}>
      <DialogTitle title={step === 'select' ? 'Find photos online: choose products' : 'Find photos online: pick a photo for each'} onClose={handleClose} />
      {/* Dialogs render outside the page, so the theme text colour is set here */}
      <div style={{ width: 'min(1100px, 94vw)', height: '78vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', color: theme.text.primary }}>
        {step === 'select' ? (
          // The product list grows with its content: it scrolls inside this
          // area instead of spilling over the footer
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '10px 20px' }}>
            <ProductContainer onClickProduct={toggleProduct} filterSelected={true} selectedProducts={selected} />
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 13, color: theme.text.tertiary }}>
              {searchEnabled ? (
                <>
                  Pick the photo that really shows the product, take one with the camera, or Skip. Check for the wrong item or another brand's logo.{' '}
                  <a href='https://www.pexels.com' target='_blank' rel='noopener noreferrer' style={{ color: theme.color.info }}>Photos from Pexels</a>
                </>
              ) : (
                <>Take a photo of each product with the camera, or Skip. (Online photo search needs PEXELS_API_KEY in the API settings.)</>
              )}
            </span>
            {products.map(productBlock)}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderTop: theme.border.quaternary, backgroundColor: theme.background.primary, position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <span style={{ flex: 1, fontSize: 14, color: theme.text.secondary }}>
            {step === 'select'
              ? `${selected.length} product${selected.length === 1 ? '' : 's'} selected`
              : `${toSave.length} photo${toSave.length === 1 ? '' : 's'} picked`}
          </span>
          {step === 'pick' && (
            <Button disabled={saving} onClick={() => setStep('select')} style={{ backgroundColor: `${theme.text.tertiary}22`, color: theme.text.secondary }}>
              Back
            </Button>
          )}
          {step === 'select' ? (
            <Button
              loading={loading}
              disabled={!selected.length}
              onClick={handleNext}
              style={{ backgroundColor: `${theme.color.info}${selected.length ? '22' : '11'}`, color: theme.color.info }}
            >
              Next
            </Button>
          ) : (
            <Button
              loading={saving}
              disabled={!toSave.length}
              onClick={handleSave}
              style={{ backgroundColor: `${theme.color.info}${toSave.length ? '22' : '11'}`, color: theme.color.info }}
            >
              Save {toSave.length} picture{toSave.length === 1 ? '' : 's'}
            </Button>
          )}
        </div>
      </div>
      <CameraDialog
        open={!!cameraFor}
        title={`Take photo: ${cameraName}`}
        onCapture={handleCapture}
        onClose={() => setCameraFor(null)}
      />
    </AlertDialog>
  )
}
