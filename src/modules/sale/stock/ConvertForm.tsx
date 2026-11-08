import Button from 'components/shared/ButtonWrapper'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import { DialogTitle } from 'components/shared/DialogTitle'
import { DetailField, FileField, LocaleField, SelectField, TextField } from 'components/shared/form'
import { IImage } from 'components/shared/form/UploadField'
import CropFreeIcon from '@mui/icons-material/CropFree'
import { currencyOptions } from 'constants/variables'
import Axios from 'constants/functions/Axios'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  getListBrand,
  getListCategory,
  getListCodeProduct,
  selectListBrand,
  selectListCategory,
  selectListCodeProduct,
} from 'shared/redux'
import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import useWeb from 'hooks/useWeb'
import useUnsavedChanges from 'hooks/useUnsavedChanges'
import { useEffect, useMemo, useState } from 'react'
import { currencyFormat } from 'utils'

const initNewProduct = { name: {}, price: '', currency: 'USD', code: '', brand: '', category: '', status: true, description: '' }

// Shown under a field; the shared `hint` prop is drawn over the floating label.
// It sits in the 20px space TextField keeps under the input for its error
// message, so callers hide it while the field has an error.
const HelperText = ({ theme, children }: any) => (
  <div style={{ fontSize: 12, color: theme.text.quaternary, marginTop: -18, paddingLeft: 7 }}>
    {children}
  </div>
)

const statusOptions = [
  { label: 'Enabled', value: true },
  { label: 'Disable', value: false },
]

// Converts whole bundles of this product (e.g. reams) into another product's
// stock (e.g. sheets), either an existing product or one created here
export const ConvertForm = ({ dialog, setDialog, product, stocks, theme, onConverted }: any) => {
  const dispatch = useAppDispatch()
  const { data: listProduct } = useAppSelector(selectListCodeProduct)
  const { data: listBrand } = useAppSelector(selectListBrand)
  const { data: listCategory } = useAppSelector(selectListCategory)
  const { user } = useAuth()
  const { lang } = useLanguage()
  const { notify, loadify } = useNotify()
  const [images, setImages] = useState<IImage[]>([])
  const [profile, setProfile] = useState<string | null>(null)
  const [imagesTouched, setImagesTouched] = useState(false)
  const { width } = useWeb()
  const [mode, setMode] = useState<'existing' | 'new'>('existing')
  const [toProduct, setToProduct] = useState('')
  const [newProduct, setNewProduct] = useState<any>(initNewProduct)
  const [ratio, setRatio] = useState<any>('')
  const [quantity, setQuantity] = useState<any>(1)
  // `split`: 1 of this = ratio of target. `merge`: ratio of this = 1 of target.
  const [direction, setDirection] = useState<'split' | 'merge'>('split')
  const [errors, setErrors] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  const productName = (item) => item?.name?.[lang] || item?.name?.['English'] || ''
  const canCreateProduct = !!user?.privilege?.product?.create

  // Batches oldest first, the order the API takes them in
  const batches = useMemo(() => [...(stocks || [])]
    .filter((stock) => stock.quantity > 0)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()), [stocks])
  const available = batches.reduce((total, stock) => total + stock.quantity, 0)

  useEffect(() => {
    if (!dialog.open) return
    dispatch(getListCodeProduct())
    dispatch(getListBrand())
    dispatch(getListCategory())
    const last = product?.lastConversion
    setMode(last?.product ? 'existing' : 'new')
    setToProduct(last?.product || '')
    setRatio(last?.ratio || '')
    setDirection(last?.direction === 'merge' ? 'merge' : 'split')
    setQuantity(1)
    setNewProduct({
      ...initNewProduct,
      currency: product?.currency || 'USD',
      brand: product?.brand?._id || product?.brand || '',
      category: product?.category?._id || product?.category || '',
    })
    // Start with the source product's photos; the user can add or remove them
    setImages((product?.images || []).filter((image) => image?.filename))
    setProfile(product?.profile?._id || product?.profile || null)
    setImagesTouched(false)
    setErrors({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.open])

  const productOptions = useMemo(() => listProduct
    .filter((item: any) => item._id !== product?._id)
    .map((item: any) => ({ value: item._id, label: productName(item) || item.code || item._id })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listProduct, product?._id, lang])

  const toOptions = (list) => list.map((item: any) => ({ value: item._id, label: productName(item) }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const brandOptions = useMemo(() => toOptions(listBrand), [listBrand, lang])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categoryOptions = useMemo(() => toOptions(listCategory), [listCategory, lang])

  const ratioValue = parseInt(ratio) || 0
  const quantityValue = parseInt(quantity) || 0
  const isMerge = direction === 'merge'
  // Break down: the input is how many to convert. Combine: how many to make.
  const consumedQuantity = isMerge ? quantityValue * ratioValue : quantityValue
  const produced = isMerge ? quantityValue : quantityValue * ratioValue

  // Same cost rule as the API: consumed batch cost spread over the new units
  const preview = useMemo(() => {
    let remaining = consumedQuantity
    const consumed: any[] = []
    for (const stock of batches) {
      if (remaining < 1) break
      const take = Math.min(remaining, stock.quantity)
      consumed.push({ cost: stock.cost * take, currency: stock.currency || 'USD' })
      remaining -= take
    }
    const currencies = Array.from(new Set(consumed.map((item) => item.currency)))
    const currency = currencies.length === 1 ? currencies[0] : 'USD'
    const sellRate = user?.drawer?.sellRate || 4000
    const totalCost = consumed.reduce((total, item) => total + (currency === 'USD' && item.currency === 'KHR' ? item.cost / sellRate : item.cost), 0)
    return { currency, unitCost: produced > 0 ? totalCost / produced : 0 }
  }, [batches, consumedQuantity, produced, user?.drawer?.sellRate])

  const targetName = mode === 'existing'
    ? productOptions.find((option) => option.value === toProduct)?.label
    : newProduct.name?.[lang] || newProduct.name?.['English']

  const handleClose = () => setDialog({ ...dialog, open: false })
  // Typing in the dialog counts as a change; ✕, Cancel and the backdrop ask first
  const { guardClose, trackChanges } = useUnsavedChanges({ enabled: !!dialog.open })
  const handleCancel = guardClose(handleClose)

  // Same upload flow as the product form
  const handleChangeImages = (event) => {
    const files = event.target.files
    const formData = new FormData()
    for (let index = 0; index < files.length; index++) {
      formData.append('images', files[index])
    }
    const response = Axios({
      method: 'POST',
      url: '/shared/upload/image',
      body: formData,
      headers: { 'content-type': 'multipart/form-data' },
    })
    loadify(response)
    response.then((data) => {
      setImagesTouched(true)
      const uploaded: IImage[] = data.data.data.map((file) => ({ filename: file.filename, _id: file._id }))
      setImages((prev) => [...prev, ...uploaded])
      setProfile((prev) => (prev && images.some((image) => image._id === prev)) ? prev : uploaded[0]?._id)
    })
  }

  const handleDeleteImage = (id) => {
    const remaining = images.filter((image) => image._id !== id)
    setImagesTouched(true)
    setImages(remaining)
    if (profile === id || !remaining.some((image) => image._id === profile)) setProfile(remaining[0]?._id || null)
  }

  const validate = () => {
    const err: any = {}
    if (mode === 'existing' && !toProduct) err.toProduct = 'Please select a product'
    if (mode === 'new') {
      if (!newProduct.name?.['English']) err.name = { English: { message: 'Name is required' } }
      if (newProduct.price === '' || Number(newProduct.price) < 0) err.price = 'Price is required'
      if (!newProduct.brand) err.brand = 'Brand is required'
      if (!newProduct.category) err.category = 'Category is required'
    }
    if (!Number.isInteger(Number(ratio)) || ratioValue < 1) err.ratio = 'Must be a whole number of at least 1'
    if (!Number.isInteger(Number(quantity)) || quantityValue < 1) err.quantity = 'Must be a whole number of at least 1'
    else if (consumedQuantity > available) {
      err.quantity = isMerge
        ? `Needs ${consumedQuantity}, only ${available} available`
        : `Only ${available} available`
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleConvert = () => {
    if (!validate()) return
    setIsLoading(true)
    Axios({
      method: 'POST',
      url: '/sale/stock/convert',
      body: {
        fromProduct: product._id,
        ...(mode === 'existing'
          ? { toProduct }
          : {
              newProduct: {
                ...newProduct,
                price: Number(newProduct.price),
                // Untouched and empty: let the API copy the source's main photo
                ...((imagesTouched || images.length > 0) && {
                  images: images.map((image) => image._id),
                  profile: images.some((image) => image._id === profile) ? profile : images[0]?._id || null,
                }),
              },
            }),
        direction,
        ratio: ratioValue,
        // The API always takes the number of this product's units used
        quantity: consumedQuantity,
      },
    })
      .then((response) => {
        notify(response?.data?.msg, 'success')
        handleClose()
        onConverted?.(response?.data?.data)
      })
      .catch((err) => notify(err?.response?.data?.msg || err?.message, 'error'))
      .finally(() => setIsLoading(false))
  }

  const toggleStyle = (active) => ({
    flex: 1,
    backgroundColor: active ? `${theme.color.info}22` : 'transparent',
    color: active ? theme.color.info : theme.text.secondary,
    border: theme.border.quaternary,
  })

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCancel}>
      <DialogTitle title='Convert Stock' onClose={handleCancel} />
      <div
        {...trackChanges}
        style={{
          fontFamily: theme.font.family,
          width: width < 1024 ? '80vw' : '50vw',
          padding: 20,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
        }}
      >
        <div style={{ display: 'flex', gap: 10 }}>
          <Button style={toggleStyle(mode === 'existing')} onClick={() => setMode('existing')}>
            Existing Product
          </Button>
          {canCreateProduct && (
            <Button style={toggleStyle(mode === 'new')} onClick={() => setMode('new')}>
              New Product
            </Button>
          )}
        </div>

        {mode === 'existing' ? (
          <SelectField
            search={true}
            label='Convert To'
            value={toProduct}
            options={productOptions}
            err={errors.toProduct}
            onChange={(event) => setToProduct(event.target.value as string)}
          />
        ) : (
          // Same layout as the product form (modules/organize/product/Form.tsx)
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gridColumnGap: 20,
              gridTemplateAreas: `
                'category category brand brand'
                'product product product product'
                'price price price currency'
                'status code code code'
                'profile profile profile profile'
                'description description description description'
              `,
            }}
          >
            <div style={{ gridArea: 'category' }}>
              <SelectField
                search={true}
                label='Category'
                value={newProduct.category}
                options={categoryOptions}
                err={errors.category}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, category: event.target.value }))}
              />
            </div>
            <div style={{ gridArea: 'brand' }}>
              <SelectField
                search={true}
                label='Brand'
                value={newProduct.brand}
                options={brandOptions}
                err={errors.brand}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, brand: event.target.value }))}
              />
            </div>
            <div style={{ gridArea: 'product', marginTop: 20, marginBottom: 20 }}>
              <LocaleField
                describe='Product'
                name='name'
                err={errors.name}
                defaultValue={newProduct.name}
                onChange={(name) => setNewProduct((prev) => ({ ...prev, name }))}
              />
            </div>
            <div style={{ gridArea: 'price' }}>
              <TextField
                type='number'
                step='any'
                label='Price'
                err={errors.price}
                value={newProduct.price}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, price: event.target.value }))}
              />
              {!errors.price && ratioValue > 0 && product?.price > 0 && (
                <HelperText theme={theme}>
                  {isMerge
                    ? <>{productName(product)} price × {ratioValue} = {Number((product.price * ratioValue).toFixed(4))}</>
                    : <>{productName(product)} price ÷ {ratioValue} = {Number((product.price / ratioValue).toFixed(4))}</>}
                </HelperText>
              )}
            </div>
            <div style={{ gridArea: 'currency' }}>
              <SelectField
                label='Currency'
                value={newProduct.currency}
                options={currencyOptions}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, currency: event.target.value }))}
              />
            </div>
            <div style={{ gridArea: 'status' }}>
              <SelectField
                label='Status'
                value={newProduct.status}
                options={statusOptions}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, status: event.target.value }))}
              />
            </div>
            <div style={{ gridArea: 'code' }}>
              <TextField
                type='text'
                label='Code'
                icon={<CropFreeIcon fontSize='small' />}
                value={newProduct.code}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, code: event.target.value }))}
              />
            </div>
            <div style={{ gridArea: 'profile' }}>
              <FileField
                height={200}
                images={images}
                name='profile'
                label='Images'
                accept='image/png, image/jpeg'
                multiple
                selected={profile || undefined}
                onChange={handleChangeImages}
                handleDelete={handleDeleteImage}
                handleChangeActive={(active) => setProfile(active)}
              />
            </div>
            <div style={{ gridArea: 'description' }}>
              <DetailField
                type='text'
                label='Description'
                style={{ height: 70 }}
                value={newProduct.description}
                onChange={(event) => setNewProduct((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <Button style={toggleStyle(!isMerge)} onClick={() => setDirection('split')}>
            Break Down (1 → many)
          </Button>
          <Button style={toggleStyle(isMerge)} onClick={() => setDirection('merge')}>
            Combine (many → 1)
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 20 }}>
          <div>
            <TextField
              type='number'
              step='1'
              min='1'
              label={isMerge
                ? `${productName(product)} per 1 ${targetName || 'target'}`
                : `1 ${productName(product)} =`}
              err={errors.ratio}
              value={ratio}
              onChange={(event) => setRatio(event.target.value)}
            />
            {!errors.ratio && (
              <HelperText theme={theme}>
                {isMerge
                  ? `${ratioValue || 'N'} ${productName(product)} = 1 ${targetName || 'target product'}`
                  : `units of ${targetName || 'the target product'}`}
              </HelperText>
            )}
          </div>
          <div>
            <TextField
              type='number'
              step='1'
              min='1'
              label={isMerge ? 'Number to Make' : 'Number to Convert'}
              err={errors.quantity}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
            {!errors.quantity && (
              <HelperText theme={theme}>
                {isMerge
                  ? `Uses ${consumedQuantity} of ${available} ${productName(product)}`
                  : `${available} ${productName(product)} available`}
              </HelperText>
            )}
          </div>
        </div>

        <div
          style={{
            padding: 15,
            borderRadius: theme.radius.secondary,
            backgroundColor: `${theme.color.info}11`,
            color: theme.text.secondary,
            lineHeight: 1.7,
          }}
        >
          <div>
            <b>{consumedQuantity.toLocaleString()} {productName(product)}</b> → <b>{produced.toLocaleString()} {targetName || '...'}</b>
          </div>
          <div>
            Unit cost: {preview.currency === 'KHR'
              ? currencyFormat(preview.unitCost, 'KHR', 2)
              : `$${Number(preview.unitCost.toFixed(4))}`}
          </div>
          <div>Remaining {productName(product)}: {Math.max(available - consumedQuantity, 0)}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Button
            onClick={handleCancel}
            style={{ backgroundColor: `${theme.color.error}22`, color: theme.color.error }}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onClick={handleConvert}
            style={{ marginLeft: 10, backgroundColor: `${theme.color.info}22`, color: theme.color.info }}
          >
            Convert
          </Button>
        </div>
      </div>
    </AlertDialog>
  )
}
