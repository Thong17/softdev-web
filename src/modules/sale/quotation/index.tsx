import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import {
  InvoiceForm,
  ITransactionItem,
} from 'components/shared/form/InvoiceForm'
import useWeb from 'hooks/useWeb'
import { getInfoStore, selectInfoStore, selectStore } from 'modules/organize/store/redux'
import { useEffect, useRef, useState } from 'react'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { IconButton, Tooltip } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ProductForm } from '../cashing/ProductForm'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import { BarcodeReader } from 'components/shared/barcode/BarcodeReader'
import { getListCodeProduct, selectListCodeProduct } from 'shared/redux'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import Breadcrumb from 'components/shared/Breadcrumbs'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded'
import { CustomButton } from 'styles'
import useAlert from 'hooks/useAlert'
import { convertQuotation, exportQuotationExcel, getQuotation, quotationStatus, saveQuotation } from './api'
import { QuotationPdfExporter } from './QuotationDocument'
import { StatusChip } from './StatusChip'

const DEFAULT_VALID_DAYS = 7
const toDateInput = (date) => moment(date).format('YYYY-MM-DD')

const Header = ({ theme, language, quotation, status, expireAt, onChangeExpireAt, locked, canConvert, converting, onConvert }) => (
  <>
    <Breadcrumb
      title={<PriceChangeRoundedIcon />}
      stages={[
        { title: language['SALE'], path: '/sale' },
        { title: language['QUOTATION'], path: '/sale/quotation' },
        { title: quotation?.invoice || 'New' },
      ]}
    />
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <StatusChip quotation={{ ...quotation, expireAt: moment(expireAt).endOf('day').toDate() }} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.text.secondary, fontSize: 13, whiteSpace: 'nowrap' }}>
        Valid&nbsp;until
        <input
          type='date'
          value={expireAt}
          disabled={locked}
          onChange={(event) => onChangeExpireAt(event.target.value)}
          style={{
            background: 'transparent',
            color: status === 'Expired' ? theme.color.error : theme.text.primary,
            border: theme.border.quaternary,
            borderRadius: theme.radius.primary,
            padding: '5px 8px',
            fontFamily: 'inherit',
            colorScheme: 'light dark',
          }}
        />
      </label>
      {!locked && (
        <Tooltip title={canConvert ? 'Add these items to the cashing cart at the quoted prices' : 'Extend the expiry date to convert'}>
          <span>
            <CustomButton
              styled={theme}
              isLoading={converting}
              disabled={!canConvert}
              onClick={onConvert}
              style={{
                backgroundColor: `${theme.color.info}22`,
                color: canConvert ? theme.color.info : theme.text.quaternary,
                whiteSpace: 'nowrap',
              }}
            >
              <PointOfSaleRoundedIcon style={{ fontSize: 18, marginRight: 6 }} />
              To&nbsp;Cash
            </CustomButton>
          </span>
        </Tooltip>
      )}
    </div>
  </>
)

// Same layout as Cashing, but items stay local until saved as a quotation, so
// stock is never deducted
export const Quotation = () => {
  const { notify, loadify } = useNotify()
  const { device } = useWeb()
  const { theme } = useTheme()
  const { lang, language } = useLanguage()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: listCode } = useAppSelector(selectListCodeProduct)
  const { data: preview } = useAppSelector(selectInfoStore)
  const { data: store } = useAppSelector(selectStore)
  const [productDialog, setProductDialog] = useState<any>({
    open: false,
    productId: null,
  })
  const [transaction, setTransaction] = useState<ITransactionItem | null>(null)
  const [reload, setReload] = useState(false)
  const [saved, setSaved] = useState<any>(null)
  const [pdfQuotation, setPdfQuotation] = useState<any>(null)
  const [expireAt, setExpireAt] = useState(() => toDateInput(moment().add(DEFAULT_VALID_DAYS, 'days')))
  const [converting, setConverting] = useState(false)
  const confirm = useAlert()
  const invoiceRef = useRef<any>()

  // Converted quotations are read-only; the date on screen decides "expired"
  const locked = saved?.status === 'CONVERTED'
  const status = quotationStatus({ status: saved?.status, expireAt: moment(expireAt).endOf('day').toDate() })
  const canConvert = !locked && status !== 'Expired'

  useEffect(() => {
    dispatch(getInfoStore())
    dispatch(getListCodeProduct())
  }, [dispatch])

  useEffect(() => {
    if (!id || saved?._id === id) return
    getQuotation(id)
      .then((data) => {
        setSaved(data)
        if (data?.expireAt) setExpireAt(toDateInput(data.expireAt))
        invoiceRef.current?.loadQuotation(data)
      })
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleClickProduct = (productId) => {
    setProductDialog({ ...productDialog, productId })
  }

  const handleScanProduct = (code) => {
    const scanned = listCode.find((item: any) => item.code === code || item.stockCodes?.includes(code))
    if (!scanned) return
    setProductDialog({ ...productDialog, productId: scanned._id })
  }

  const handleAddTransaction = (data) => {
    setTransaction({
      id: data._id,
      product: data.product?._id,
      description: data.description,
      discount: {
        value: data.discount?.value || 0,
        currency: data.discount?.type || 'PCT',
        isFixed: data.discount?.isFixed || false,
      },
      price: { value: data.price, currency: data.currency },
      quantity: data.quantity,
      total: data.total,
      profile: data.product?.profile?.filename,
      color: data.color || null,
      options: data.options || [],
      customerOption: data.customer || null,
    })
  }

  const persist = async (data) => {
    // Stays on the same URL: `quotation` and `quotation/:id` are separate
    // routes, so navigating here would remount the screen mid-export
    const quotation = await saveQuotation(saved?._id, data, moment(expireAt).endOf('day').toISOString())
    setSaved(quotation)
    return quotation
  }

  // Saves first so cashing gets exactly what is on screen, then creates the
  // cart items (taking stock) and opens cashing with them
  const handleConvert = () => {
    const data = invoiceRef.current?.getQuotationData()
    if (!data?.transactions?.length) return notify('No transaction added', 'error')
    confirm({
      title: 'Send to cashing?',
      description: 'The items will be added to the cashing cart at the quoted prices and taken from stock. The quotation locks once the sale is paid.',
      variant: 'info',
    })
      .then(async () => {
        setConverting(true)
        try {
          const quotation = await persist(data)
          const result = await convertQuotation(quotation._id)
          navigate('/sale/cashing', { state: { fromQuotation: result } })
        } catch (err: any) {
          notify(err?.response?.data?.msg || err?.message, 'error')
        } finally {
          setConverting(false)
        }
      })
      .catch(() => {})
  }

  const handleSave = (data) => {
    const response = persist(data)
    loadify(response)
  }

  // Exports always save first so the file matches what is on screen
  const handleExportExcel = (data) => {
    const response = persist(data).then((quotation) => exportQuotationExcel(quotation._id, lang))
    response.catch((err) => notify(err?.response?.data?.msg || err?.message, 'error'))
  }

  const handleExportPdf = (data) => {
    persist(data)
      .then((quotation) => setPdfQuotation(quotation))
      .catch((err) => notify(err?.response?.data?.msg || err?.message, 'error'))
  }

  const handleClear = () => {
    invoiceRef?.current?.callClearPayment()
    setSaved(null)
    setExpireAt(toDateInput(moment().add(DEFAULT_VALID_DAYS, 'days')))
    if (id) navigate('/sale/quotation/create', { replace: true })
  }

  return (
    <Container
      header={
        <Header
          theme={theme}
          language={language}
          quotation={saved}
          status={status}
          expireAt={expireAt}
          onChangeExpireAt={setExpireAt}
          locked={locked}
          canConvert={canConvert}
          converting={converting}
          onConvert={handleConvert}
        />
      }
    >
      <BarcodeReader onScan={handleScanProduct} onError={() => {}} />
      <QuotationPdfExporter
        quotation={pdfQuotation}
        store={store}
        onDone={(err) => {
          if (err) notify(err?.message || 'Failed to export PDF', 'error')
          setPdfQuotation(null)
        }}
      />
      <ProductForm
        mode='quotation'
        dialog={productDialog}
        setDialog={setProductDialog}
        addTransaction={handleAddTransaction}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            device === 'mobile' || device === 'tablet' ? '1fr' : '1fr auto',
          gridTemplateAreas:
            device === 'mobile' || device === 'tablet'
              ? `'invoice invoice''product product'`
              : `'product invoice'`,
          gridGap: 30,
          height: 'fit-content',
        }}
      >
        <div style={{ gridArea: 'product' }}>
          <ProductContainer
            onClickProduct={handleClickProduct}
            filterPromotion={true}
            toggleReload={reload}
            isDisabled={locked}
            actions={
              <>
                <IconButton
                  onClick={() => setReload(!reload)}
                  style={{
                    color: theme.text.secondary,
                    width: 30,
                    height: 30,
                    marginRight: 10,
                  }}
                >
                  <ReplayRoundedIcon style={{ fontSize: 21 }} />
                </IconButton>
              </>
            }
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gridArea: 'invoice',
          }}
        >
          <InvoiceForm
            ref={invoiceRef}
            mode='quotation'
            defaultTax={preview?.tax}
            transaction={transaction}
            onUpdate={() => setReload(!reload)}
            onUpdateStock={() => {}}
            onClear={handleClear}
            onChangeCustomer={() => {}}
            onChangePayment={() => {}}
            onSave={handleSave}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            invoice={saved?.invoice}
            disableForm={locked}
          />
        </div>
      </div>
    </Container>
  )
}

export { QuotationList } from './List'
