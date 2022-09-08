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
import { InvoiceForm } from './InvoiceForm'

export const Cashing = ({ id = null, transactions = [], customer, reservationData = null }: any) => {
  const { user } = useAuth()
  const { notify } = useNotify()
  const { device } = useWeb()
  const dispatch = useAppDispatch()
  const { data: preview } = useAppSelector(selectInfoStore)
  const [paymentId, setPaymentId] = useState(id)
  const [reservation, setReservation] = useState(reservationData)
  const [productDialog, setProductDialog] = useState({
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
  const [reload, setReload] = useState(false)

  useEffect(() => {
    dispatch(getInfoStore())
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
    setPaymentDialog(prev => ({ ...prev, payment: reservation?.payment }))
  }, [reservation?.payment])
  
  const handleClickProduct = (id) => {
    setProductDialog({ productId: id, open: true })
  }

  const handleAddTransaction = (data) => {
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
    })
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
    invoiceRef?.current?.callClearPayment()
    setPaymentDialog({
      open: false,
      payment: null,
      customer: null,
    })
  }

  const handleChangePayment = (data) => {
    setPaymentDialog({
      ...paymentDialog,
      payment: data,
    })
  }

  const handleCheckedIn = (data) => {
    setReservation(data)
  }

  const handleCheckedOut = (data) => {
    setReservation(data)
  }

  return (
    <Container>
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
            isDisabled={reservation && !reservation.payment}
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
            onPayment={handlePayment}
            onChangeCustomer={handleChangeCustomer}
            onChangePayment={handleChangePayment}
            listTransactions={transactions}
            selectedCustomer={customer}
            reservationData={reservation}
            onCheckIn={handleCheckedIn}
            onCheckOut={handleCheckedOut}
          />
        </div>
      </div>
    </Container>
  )
}
