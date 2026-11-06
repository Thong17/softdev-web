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
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import { IconButton, Tooltip } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ProductForm } from '../cashing/ProductForm'
import useNotify from 'hooks/useNotify'
import useLanguage from 'hooks/useLanguage'
import { BarcodeReader } from 'components/shared/barcode/BarcodeReader'
import { getListCodeProduct, selectListCodeProduct } from 'shared/redux'
import { useNavigate, useParams } from 'react-router-dom'
import { exportQuotationExcel, getQuotation, saveQuotation } from './api'
import { QuotationPdfExporter } from './QuotationDocument'

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
  const invoiceRef = useRef<any>()

  useEffect(() => {
    dispatch(getInfoStore())
    dispatch(getListCodeProduct())
  }, [dispatch])

  useEffect(() => {
    if (!id || saved?._id === id) return
    getQuotation(id)
      .then((data) => {
        setSaved(data)
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
    })
  }

  const persist = async (data) => {
    // Stays on the same URL: `quotation` and `quotation/:id` are separate
    // routes, so navigating here would remount the screen mid-export
    const quotation = await saveQuotation(saved?._id, data)
    setSaved(quotation)
    return quotation
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
    if (id) navigate('/sale/quotation', { replace: true })
  }

  return (
    <Container>
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
            actions={
              <>
                <Tooltip title={language['QUOTATION_LIST']}>
                  <IconButton
                    onClick={() => navigate('/sale/quotation/list')}
                    style={{
                      color: theme.color.info,
                      width: 30,
                      height: 30,
                      marginRight: 10,
                    }}
                  >
                    <ListAltRoundedIcon style={{ fontSize: 22 }} />
                  </IconButton>
                </Tooltip>
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
          />
        </div>
      </div>
    </Container>
  )
}

export { QuotationList } from './List'
