import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import {
  InvoiceForm,
  ITransactionItem,
} from 'components/shared/form/InvoiceForm'
import useWeb from 'hooks/useWeb'
import { getInfoStore, selectInfoStore } from 'modules/organize/store/redux'
import { useEffect, useRef, useState } from 'react'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ProductForm } from './ProductForm'
import { DrawerForm } from './DrawerForm'
import { PaymentForm } from './PaymentForm'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { BarcodeReader } from 'components/shared/barcode/BarcodeReader'
import { getListCodeProduct, selectListCodeProduct } from 'shared/redux'

export const Cashing = () => {
  const { user } = useAuth()
  const { notify } = useNotify()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data: listCode } = useAppSelector(selectListCodeProduct)
  const { data: preview } = useAppSelector(selectInfoStore)
  const [paymentId, setPaymentId] = useState(null)
  const [disableProduct, setDisableProduct] = useState(false)
  const [productDialog, setProductDialog] = useState<any>({
    open: false,
    productId: null,
  })
  
  const [drawerDialog, setDrawerDialog] = useState({ open: false })
  const [paymentDialog, setPaymentDialog] = useState<any>({
    open: false,
    payment: null,
    customer: null,
  })
  const { theme } = useTheme()
  const [transaction, setTransaction] = useState<ITransactionItem | null>(null)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    dispatch(getInfoStore())
    dispatch(getListCodeProduct())
  }, [dispatch])

  const handleClickProduct = (id) => {
    setProductDialog({ ...productDialog, productId: id })
  }

  const handlePayment = (data) => {
    if (data.transactions.length < 1)
      return notify('No transaction added', 'error')
    if (paymentDialog.payment) {
      return setPaymentDialog({ ...paymentDialog, open: true })
    }
    const body = {
      transactions: data.transactions.map((transaction) => transaction.id),
      discounts: [data.discount],
      vouchers: [data.voucher],
      services: [data.tax],
      customer: paymentDialog.customer?.id,
    }

    Axios({
      method: 'POST',
      url: '/sale/payment/create',
      body,
    })
      .then((data) => {
        setPaymentDialog({
          ...paymentDialog,
          open: true,
          payment: data?.data?.data,
        })
        setPaymentId(data?.data?.data?._id)
      })
      .catch((err) => {
        notify(err?.response?.data?.msg, 'error')
      })
  }

  const handleChangeCustomer = (data) => {
    setPaymentDialog({ ...paymentDialog, customer: data })
  }

  const invoiceRef = useRef<any>()
  const paymentRef = useRef<any>()
  const handleClearPayment = () => {
    invoiceRef?.current?.callClearPayment()
    paymentRef?.current?.callClearPayment()
    setPaymentDialog({
      open: false,
      payment: null,
      customer: null,
    })
    setDisableProduct(false)
  }

  const handleChangePayment = (data) => {
    setPaymentDialog({
      ...paymentDialog,
      payment: data,
    })
  }

  const handleScanProduct = (code) => {
    const scannedStock = listCode.find((item: any) => item.stockCodes.includes(code))
    if (scannedStock) {
      Axios({
        method: 'POST',
        url: '/sale/transaction/stock',
        body: {
          stock: scannedStock.stocks.find(item => item.code === code)._id,
          quantity: 1,
        }
      }).then(response => {
        const data = response?.data?.data
        setReload(!reload)
        setTransaction({
          id: data._id,
          description: data.description,
          discount: {
            value: data.discount?.value || 0,
            currency: data.discount?.type || 'PCT',
            isFixed: data.discount?.isFixed || false,
          },
          price: { value: data.price, currency: data.currency },
          quantity: data.quantity,
          total: data.total,
          profile: data.product?.profile?.filename
        })
      }).catch(err => {
        notify(err?.response?.data?.msg, 'error')
      })
      return
    }
    
    const scannedProduct = listCode.find((item: any) => item.code === code)    
    if (!scannedProduct) return
    setProductDialog({ ...productDialog, productId: scannedProduct._id })
  }

  const [stockProducts, setStockProducts] = useState({})
  
  const handleUpdateStock = (data) => {
    setStockProducts(data)
  }

  const handleAddTransaction = (data, stockRemain) => {
    setStockProducts(stockRemain)
    setTransaction({
      id: data._id,
      description: data.description,
      discount: {
        value: data.discount?.value || 0,
        currency: data.discount?.type || 'PCT',
        isFixed: data.discount?.isFixed || false,
      },
      price: { value: data.price, currency: data.currency },
      quantity: data.quantity,
      total: data.total,
      profile: data.product?.profile?.filename
    })
  }

  return (
    <Container>
      <BarcodeReader onScan={handleScanProduct} onError={() => {}} />
      <ProductForm
        dialog={productDialog}
        setDialog={setProductDialog}
        addTransaction={handleAddTransaction}
      />
      <DrawerForm dialog={drawerDialog} setDialog={setDrawerDialog} />
      <PaymentForm
        ref={paymentRef}
        dialog={paymentDialog}
        setDialog={setPaymentDialog}
        onClear={handleClearPayment}
        onCheckout={() => setDisableProduct(true)}
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
            updateStocks={stockProducts}
            isDisabled={disableProduct}
            actions={
              <>
                <IconButton
                  onClick={() =>
                    setDrawerDialog({ ...drawerDialog, open: true })
                  }
                  style={{
                    color: user?.drawer?.status
                      ? theme.color.success
                      : theme.color.error,
                    width: 30,
                    height: 30,
                    marginRight: 10,
                  }}
                >
                  <PriceChangeRoundedIcon style={{ fontSize: 23 }} />
                </IconButton>
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
            id={paymentId}
            defaultTax={preview?.tax}
            transaction={transaction}
            onUpdate={() => setReload(!reload)}
            onUpdateStock={handleUpdateStock}
            onPayment={handlePayment}
            onClear={handleClearPayment}
            onChangeCustomer={handleChangeCustomer}
            onChangePayment={handleChangePayment}
          />
        </div>
      </div>
    </Container>
  )
}
