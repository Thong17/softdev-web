import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { ProductContainer } from 'components/shared/container/ProductContainer'
import {
  ITransactionItem,
} from 'components/shared/form/InvoiceForm'
import useWeb from 'hooks/useWeb'
import { getInfoStore, selectInfoStore } from 'modules/organize/store/redux'
import { useEffect, useRef, useState } from 'react'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'
import { ProductForm } from '../cashing/ProductForm'
import { DrawerForm } from '../cashing/DrawerForm'
import { PaymentForm } from './PaymentForm'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import { InvoiceForm, mappedTransaction } from './InvoiceForm'
import { BarcodeReader } from 'components/shared/barcode/BarcodeReader'
import { getListCodeProduct, selectListCodeProduct } from 'shared/redux'

export const Cashing = ({ id = null, transactions = [], customer, reservationData = null, onReload }: any) => {
  const { user } = useAuth()
  const { notify } = useNotify()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data: preview } = useAppSelector(selectInfoStore)
  const [paymentId, setPaymentId] = useState(id)
  const [reservation, setReservation] = useState(reservationData)
  const { data: listCode } = useAppSelector(selectListCodeProduct)
  const [productDialog, setProductDialog] = useState<any>({
    open: false,
    productId: null,
  })
  
  const [drawerDialog, setDrawerDialog] = useState({ open: false })
  const [paymentDialog, setPaymentDialog] = useState<any>({
    open: false,
    payment: null,
    customer: customer,
  })
  const { theme } = useTheme()
  const [transaction, setTransaction] = useState<ITransactionItem | null>(null)
  const [reservationTransaction, setReservationTransaction] = useState<ITransactionItem | null>(null)
  const [reload, setReload] = useState(false)
  const [disableProduct, setDisableProduct] = useState(true)

  useEffect(() => {
    dispatch(getInfoStore())
    dispatch(getListCodeProduct())
  }, [dispatch])

  useEffect(() => {
    setReservation(reservationData)
  }, [reservationData])
  
  useEffect(() => {
    setPaymentId(id)
  }, [id])

  useEffect(() => {
    setPaymentDialog(prev => ({ ...prev, customer }))
  }, [customer])

  useEffect(() => {
    let isDisabled = reservation && !reservation.payment
    let isCompleted = reservation?.isCompleted

    
    if (!reservation)  setDisableProduct(true)
    else if (!isDisabled) setDisableProduct(isCompleted)
    else setDisableProduct(true)
    
    setPaymentDialog(prev => ({ ...prev, payment: reservation?.payment }))
  }, [reservation])
  
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
  const handleClearPayment = () => {
    onReload()
  }

  const handleChangePayment = (data) => {
    setPaymentDialog({
      ...paymentDialog,
      payment: data,
    })
  }

  const handleCheckedIn = (data) => {
    setReservation(data)
    setPaymentId(data?.payment?._id)
    if (!data.payment?.transactions[0]) return
    setReservationTransaction(mappedTransaction(data.payment?.transactions[0]))
  }

  const handleCheckedOut = (data) => {
    setReservation(data)
  }

  const handleScanProduct = (code) => {
    const scannedProduct = listCode.find((item: any) => item.code === code)
    if (!scannedProduct) return
    setProductDialog({ ...productDialog, productId: scannedProduct._id })
  }

  const handleScanError = (msg) => {
    notify(msg, 'error')
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
      <BarcodeReader onScan={handleScanProduct} onError={handleScanError} />
      <ProductForm
        dialog={productDialog}
        setDialog={setProductDialog}
        addTransaction={handleAddTransaction}
      />
      <DrawerForm dialog={drawerDialog} setDialog={setDrawerDialog} />
      <PaymentForm
        dialog={paymentDialog}
        setDialog={setPaymentDialog}
        onClear={handleClearPayment}
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
            onChangeCustomer={handleChangeCustomer}
            onChangePayment={handleChangePayment}
            listTransactions={transactions}
            selectedCustomer={customer}
            reservationData={reservation}
            onCheckIn={handleCheckedIn}
            onCheckOut={handleCheckedOut}
            reservationTransaction={reservationTransaction}
          />
        </div>
      </div>
    </Container>
  )
}
