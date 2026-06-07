import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Box, IconButton } from '@mui/material'
import './css/index.css'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { ExchangeRate } from 'components/shared/ExchangeRate'
import { CashForm } from 'components/shared/form/CashForm'
import { SelectTab } from 'components/shared/form/SelectTab'
import useTheme from 'hooks/useTheme'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { CustomButton } from 'styles'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import { currencyFormat, timeFormat } from 'utils'
import useAuth from 'hooks/useAuth'
import { IDrawer } from 'contexts/auth/interface'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import useAlert from 'hooks/useAlert'
import { useReactToPrint } from 'react-to-print'
import useWeb from 'hooks/useWeb'
import { CarouselContainer } from 'components/shared/container/CarouselContainer'
import {
  getListTransfer,
  getStore,
  selectListTransfer,
  selectStore,
} from 'modules/organize/store/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useLanguage from 'hooks/useLanguage'
import { LoanForm } from 'components/shared/form/LoanForm'
import { initQzTray, handleGroupReceiptPrinting } from 'utils/printer'
import { InvoicePreview } from './InvoicePreview'

export const GroupPaymentDialog = forwardRef(({ dialog, source='payment', setDialog, onClear, onCheckout, handleRemovePayment }: any, ref) => {
  const confirm = useAlert()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { notify } = useNotify()
  const { width } = useWeb()
  const { user, reload } = useAuth()
  const [totalReceive, setTotalReceive] = useState({ KHR: 0, USD: 0, total: 0 })
  const [totalRemain, setTotalRemain] = useState({ KHR: 0, USD: 0 })
  const [payment, setPayment] = useState<any>(null)
  const [queue, setQueue] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [totalPayment, setTotalPayment] = useState({
    value: 0,
    currency: 'USD',
  })
  const [exchangeRate, setExchangeRate] = useState<null | IDrawer>(null)
  const [receiveCashes, setReceiveCashes] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const { data: listTransfer } = useAppSelector(selectListTransfer)
  const dispatch = useAppDispatch()
  const [formMode, setFormMode] = useState('pending');
  const { data: storeInfo, status } = useAppSelector(selectStore)
  const [printerSetting, setPrinterSetting] = useState({
    receiptPrinterName: '',
    receiptPrinterCharPerLine: 0,
    storePrinterName: '',
    storePrinterCharPerLine: 0,
    thermalPrinterName: '',
    thermalPrinterWidth: 0,
    thermalPrinterHeight: 0,
    thermalPrinterGap: 0
  });
  const [isQzTrayAvailable, setIsQzTrayAvailable] = useState(false);

  const paymentMethods = [
    { label: language['CASH'], value: 'cash' },
    { label: language['TRANSFER'], value: 'transfer' },
    { label: language['LOAN'], value: 'loan' },
  ]

  useEffect(() => {
    initQzTray().then(() => setIsQzTrayAvailable(true)).catch(err => console.error('QZ Tray init failed:', err))
    return () => {
      // Optional: clean up connection on unmount if desired
    };
  }, []);

  
  useEffect(() => {
    Axios({
      method: 'GET',
      url: '/organize/store/getTelegramSetting'
    })
      .then((res) => {
        const data = res.data.data
        setPrinterSetting({
          receiptPrinterName: data.receiptPrinterName || '',
          receiptPrinterCharPerLine: data.receiptPrinterCharPerLine || 0,
          storePrinterName: data.storePrinterName || '',
          storePrinterCharPerLine: data.storePrinterCharPerLine || 0,
          thermalPrinterName: data.thermalPrinterName || '',
          thermalPrinterWidth: data.thermalPrinterWidth || 0,
          thermalPrinterHeight: data.thermalPrinterHeight || 0,
          thermalPrinterGap: data.thermalPrinterGap || 0
        })
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (status !== 'INIT') return
      dispatch(
        getStore({
          id: 'store',
          fields: [
            'name',
            'logo',
            'contact',
            'address',
            'type',
            'other',
            'font',
            'tax',
          ],
        })
      )
      // eslint-disable-next-line
    }, [status])

  useEffect(() => {
    dispatch(getListTransfer())
  }, [dispatch])

  useImperativeHandle(ref, () => ({
    callClearPayment() {
      onClearPayment()
    }
  }))

  const onClearPayment = () => {
    setTotalReceive({ KHR: 0, USD: 0, total: 0 })
    setTotalRemain({ KHR: 0, USD: 0 })
    setPayment(null)
    setQueue(null)
    setPaymentMethod(null)
    setTotalPayment({ value: 0, currency: 'USD' })
    setExchangeRate(null)
    setReceiveCashes([])
  }

  useEffect(() => {
    setPayment(dialog.payment)

    const value =
      dialog.payment?.total.currency === 'KHR'
        ? dialog.payment?.total.value / dialog.payment?.rate.sellRate
        : dialog.payment?.total.value
    setTotalPayment((prev) => ({ ...prev, value: value || 0 }))
    setExchangeRate(dialog.payment?.rate)
  }, [dialog.payment])

  useEffect(() => {
    const remainUSD = totalPayment.value - totalReceive.total
    const sellRate = exchangeRate?.sellRate || 4000
    setTotalRemain({ USD: remainUSD, KHR: remainUSD * sellRate })
  }, [totalPayment, exchangeRate, totalReceive.total])

  const handleCloseDialog = () => {
    if (source === 'report') {
      onClearPayment()
      onClear && onClear()
      setFormMode('pending')
    }
    setDialog({ ...dialog, open: false })
  }

  const handleChangePaymentMethod = (value) => {
    if (value === 'transfer') {
      const buyRate = exchangeRate?.buyRate || 4000
      setTotalReceive({
        KHR: totalPayment.currency === 'KHR' ? totalPayment.value : 0,
        USD: totalPayment.currency === 'USD' ? totalPayment.value : 0,
        total:
          totalPayment.currency === 'KHR'
            ? totalPayment.value / buyRate
            : totalPayment.value,
      })
    } else setTotalReceive({ KHR: 0, USD: 0, total: 0 })
    setPaymentMethod(value)
  }

  const handleChangeCashes = (cashes) => {
    let totalUSD = 0
    let totalKHR = 0
    setReceiveCashes(cashes)
    cashes?.forEach((cash) => {
      if (cash.currency === 'USD') totalUSD += cash.value * cash.quantity
      else totalKHR += cash.value * cash.quantity
    })
    const sellRate = user?.drawer?.sellRate || 4000
    setTotalReceive({
      KHR: totalKHR,
      USD: totalUSD,
      total: totalUSD + totalKHR / sellRate,
    })
  }

  const handleAddToQueue = () => {
    setIsLoading(true)
    Axios({
      method: 'POST',
      url: '/function/queue/create',
      body: { payment: dialog?.payment?._id }
    })
      .then(data => {
        setQueue(data?.data?.data)
        handlePrintTicket()
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
      .finally(() => setIsLoading(false))
  }

  const handleCheckout = () => {
    confirm({
      title: 'Are you sure you want to check out?',
      description: 'Checkout the payment will update the status to complete.',
      variant: 'info',
    })
      .then(() => {
        setIsLoading(true);
        const body = {
          checkoutFields: {
            receiveCashes,
            receiveTotal: totalReceive,
            remainTotal: totalRemain,
            customer: dialog.customer?.id,
            paymentMethod,
          },
          paymentIds: dialog.payments.map(payment => payment._id)
        }
        Axios({
          method: 'PUT',
          url: `/sale/payment/group-checkout`,
          body,
        })
          .then((data) => {
            setPayment(data?.data?.group)
            reload()
            onCheckout && onCheckout()
            setFormMode('checkout')
          })
          .catch((err) => {
            notify(err?.response?.data?.msg, 'error')
          })
          .finally(() => setIsLoading(false));
      })
      .catch(() => null)
  }

  const handleClearPayment = () => {
    confirm({
      title: 'Are you sure you want to clear the payment?',
      description: 'The payment will be clear.',
      variant: 'error',
    })
      .then(() => {
        onClearPayment()
        onClear && onClear()
        setFormMode('pending')
      })
      .catch(() => {})
  }

  const handlePrint = () => {
    if (!isQzTrayAvailable) {
      notify('Receipt printing is not available on this device', 'error')
      return
    }
    handleGroupReceiptPrinting(dialog.payments?.map(item => ({
      name: storeInfo?.name as string,
      invoice: item?.invoice,
      cashier: item?.createdBy?.username,
      createdAt: timeFormat(item?.createdAt, 'YYYY-MM-DD HH:mm'),
      transactions: item?.transactions?.map(item => ({
          item: item.description,
          qty: item.quantity,
          disc: currencyFormat(item.discount?.value, item.discount?.type, 0, true) + (item.discount?.isFixed ? ' Fixed' : ''),
          price: currencyFormat(item.price, item.currency, 0, true),
          total: currencyFormat(item.total?.value, item.total?.currency, 0, true)
      })),
      subtotal: currencyFormat(item?.subtotal?.USD, 'USD', 0, true),
      discount: currencyFormat(item?.discounts[0]?.value, item?.discounts[0]?.type, 0, true) + (item?.discounts[0]?.isFixed ? ' Fixed' : ''),
      voucher: currencyFormat(item?.vouchers[0]?.value, item?.vouchers[0]?.type, 0, true) + (item?.vouchers[0]?.isFixed ? ' Fixed' : ''),
      tax: currencyFormat(item?.services[0]?.value, item?.services[0]?.type, 0, true),
      total: currencyFormat(item?.total?.value, item?.total?.currency, 0, true),
      address: storeInfo?.address,
      footer: storeInfo?.other,
      paymentMethod: item?.paymentMethod,
    })), printerSetting.receiptPrinterName, printerSetting.receiptPrinterCharPerLine).catch(err => notify(err.message, 'error'))
    handleGroupReceiptPrinting(dialog.payments?.map(item => ({
      name: storeInfo?.name as string,
      invoice: item?.invoice,
      cashier: item?.createdBy?.username,
      createdAt: timeFormat(item?.createdAt, 'YYYY-MM-DD HH:mm'),
      transactions: item?.transactions?.map(item => ({
          item: item.description,
          qty: item.quantity,
          disc: currencyFormat(item.discount?.value, item.discount?.type, 0, true) + (item.discount?.isFixed ? ' Fixed' : ''),
          price: currencyFormat(item.price, item.currency, 0, true),
          total: currencyFormat(item.total?.value, item.total?.currency, 0, true)
      })),
      subtotal: currencyFormat(item?.subtotal?.USD, 'USD', 0, true),
      discount: currencyFormat(item?.discounts[0]?.value, item?.discounts[0]?.type, 0, true) + (item?.discounts[0]?.isFixed ? ' Fixed' : ''),
      voucher: currencyFormat(item?.vouchers[0]?.value, item?.vouchers[0]?.type, 0, true) + (item?.vouchers[0]?.isFixed ? ' Fixed' : ''),
      tax: currencyFormat(item?.services[0]?.value, item?.services[0]?.type, 0, true),
      total: currencyFormat(item?.total?.value, item?.total?.currency, 0, true),
      address: storeInfo?.address,
      footer: storeInfo?.other,
      paymentMethod: item?.paymentMethod,
    })), printerSetting.storePrinterName, printerSetting.storePrinterCharPerLine).catch(err => notify(err.message, 'error'))
  }

  const ticketRef = useRef(document.createElement('div'))
  const handlePrintTicket = useReactToPrint({
    content: () => ticketRef?.current,
    documentTitle: 'Ticket',
  })

  const previewRef = useRef(document.createElement('div'))
  const handlePrintPreview = () => {
    previewButtonRef.current.click()
  }
  const printPreview = useReactToPrint({
    content: () => previewRef?.current,
    documentTitle: 'Preview',
  })

  const handlePreview = (data, body) => {
    printPreview()
  }

  const handleCheckoutLoan = (data) => {
    setPayment(data)
    reload()
    onCheckout && onCheckout()
    setFormMode('checkout')
  }

  const loanButtonRef = useRef(document.createElement('button'))
  const previewButtonRef= useRef(document.createElement('button'))
  const renderPaymentMethod = (method) => {
    switch (method) {
      case 'transfer':
        return (
          <CarouselContainer
            images={listTransfer?.map((item) => item.image) || []}
          />
        )

      case 'loan':
        const body = {
          receiveCashes,
          totalPaid: totalReceive,
          totalRemain: totalRemain,
        }
        return <LoanForm onLoading={setIsLoading} onChange={handleChangeCashes} onPreview={handlePreview} loanButtonRef={loanButtonRef} previewButtonRef={previewButtonRef} paymentId={dialog.payment?._id} payment={body} onCheckoutLoan={handleCheckoutLoan} formMode={formMode} />

      default:
        return <CashForm onChange={handleChangeCashes} />
    }
  }

  return (
    <AlertContainer
      justify='center'
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div
        style={{
          height: '100vh',
          width: 'calc(100vw - 64px)',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, padding: '10px 20px 0 20px' }}>
            <div style={{ display: 'flex', gap: 10, padding: '0', maxWidth: '80vw', overflowX: 'auto' }}>
                {dialog.payments?.map((payment) => (
                    <div key={payment._id} className="payment-item" style={{ backgroundColor: `${theme.text.secondary}11`, color: theme.text.secondary, borderRadius: theme.radius.ternary }}>    
                        <span>{payment.invoice}</span>
                        <IconButton onClick={() => handleRemovePayment(payment._id)}>
                            <CloseRoundedIcon fontSize='small' style={{ color: theme.text.secondary }} />
                        </IconButton>
                    </div>
                ))}
            </div>
            <IconButton onClick={handleCloseDialog}>
                <CloseRoundedIcon style={{ color: theme.text.primary }} />
            </IconButton>
        </div>
        <div
          style={{
            padding: '10px 20px 20px 20px',
            boxSizing: 'border-box',
            height: 'calc(100% - 69.98px)',
            gridGap: 20,
            display: 'grid',
            gridTemplateColumns:
              width > 1024 ? 'calc(100% - 480px) auto' : '1fr',
            gridTemplateRows: width > 1024 ? '1fr 200px' : 'auto',
            gridTemplateAreas:
              width > 1024
                ? `'payment preview''exchange preview'`
                : `
                  'payment payment'
                  'exchange exchange'
                  'preview preview'
                `,
          }}
        >
          <div
            style={{
              gridArea: 'payment',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 5px',
              }}
            >
              <SelectTab
                selected={paymentMethod ?? paymentMethods[0]?.value}
                options={paymentMethods}
                onChange={handleChangePaymentMethod}
              />
              <ExchangeRate />
            </div>
            <div
              style={{
                border: theme.border.dashed,
                borderRadius: theme.radius.ternary,
                position: 'relative',
                boxSizing: 'border-box',
                padding: 10,
                height: width > 1024 ? '100%' : '40vh',
              }}
            >
              {renderPaymentMethod(paymentMethod)}
            </div>
          </div>
          <Box
            className='exchange'
            sx={{
              height: 200,
              borderRadius: theme.radius.ternary,
              gridArea: 'exchange',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: `${theme.background.secondary}cc`,
              boxSizing: 'border-box',
              padding: '10px 10px 10px 10px',
              '& .total-receive, & .total-payment': {
                backgroundColor: `${theme.background.primary}99`,
                width: '100%',
                borderRadius: theme.radius.ternary,
              },
              '& .total-receive': {
                height: 50,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px',
                boxSizing: 'border-box',
              },
              '& .total-payment': {
                padding: '10px 10px 10px 10px',
                position: 'relative',
                height: 'calc(100% - 50px)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 0.8,
                '& span': {
                  color: Number.isNaN(totalRemain?.USD) 
                    ? theme.color.error 
                    : (totalRemain?.USD > 0 ? theme.color.error : theme.color.success),
                },
                '&::before': {
                  content: `''`,
                  borderTop: theme.border.dashed,
                  position: 'absolute',
                  top: -1,
                  left: 10,
                  display: 'block',
                  width: 'calc(100% - 20px)',
                },
              },
            }}
          >
            <div className='total-receive'>
              <span>{language['RECEIVE_TOTAL']}</span>
              <div style={{ display: 'flex', lineHeight: 1 }}>
                <span>
                  {currencyFormat(totalReceive.USD, 'USD')} +{' '}
                  {currencyFormat(totalReceive.KHR, 'KHR')} ={' '}
                  {currencyFormat(totalReceive.total, 'USD')}
                </span>
              </div>
            </div>
            <div className='total-payment'>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '5px 10px',
                  boxSizing: 'border-box',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>
                    {payment?.remainTotal?.USD < 0
                      ? language['RETURN']
                      : language['REMAIN']}{' '}
                    {language['TOTAL']}
                  </span>
                  <div style={{ display: 'flex', lineHeight: 1 }}>
                    <span>
                      {currencyFormat(totalRemain.USD, 'USD')} (
                      {currencyFormat(totalRemain.KHR, 'KHR')})
                    </span>
                  </div>
                </div>
                <Box
                  sx={{
                    display: 'flex',
                    height: 27,
                    alignItems: 'center',
                    justifyContent: 'end',
                    gap: 1.5,
                    overflowX: 'auto',
                    '& .cash': {
                      backgroundColor: `${theme.color.info}22`,
                      height: 27,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      borderRadius: theme.radius.primary,
                      color: theme.color.info,
                      lineHeight: 1,
                      '& span': {
                        color: theme.color.info + '!important',
                      },
                    },
                  }}
                >
                  {payment?.returnCashes.map((cash, key) => (
                    <CashReturn cash={cash} key={key} />
                  ))}
                </Box>
              </div>
              {paymentMethod === 'loan' ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  {payment?.status ? (
                    <>
                      <CustomButton
                        onClick={source === 'payment' ? handleClearPayment : handleCloseDialog}
                        styled={theme}
                        style={{
                          backgroundColor: `${theme.color.error}22`,
                          color: theme.color.error,
                          width: '100%',
                        }}
                      >
                        {language['CLOSE']}
                      </CustomButton>
                    </>
                  ) : (
                    <>
                      <CustomButton
                        onClick={() => handleCloseDialog()}
                        styled={theme}
                        style={{
                          backgroundColor: `${theme.color.error}22`,
                          color: theme.color.error,
                          width: '100%',
                        }}
                      >
                        {language['CLOSE']}
                      </CustomButton>
                      <CustomButton
                        isLoading={isLoading}
                        onClick={handlePrintPreview}
                        styled={theme}
                        style={{
                          backgroundColor: `${theme.color.info}22`,
                          color: theme.color.info,
                          width: '100%',
                        }}
                      >
                        {language['PREVIEW']}
                      </CustomButton>
                      <CustomButton
                        isLoading={isLoading}
                        onClick={() => loanButtonRef.current.click()}
                        styled={theme}
                        style={{
                          backgroundColor: `${theme.color.info}22`,
                          color: theme.color.info,
                          width: '100%',
                        }}
                      >
                        {language['PROCEED']}
                      </CustomButton>
                    </>
                  )}
                  
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  {payment?.status ? (
                    <CustomButton
                      onClick={source === 'payment' ? handleClearPayment : handleCloseDialog}
                      styled={theme}
                      style={{
                        backgroundColor: `${theme.color.error}22`,
                        color: theme.color.error,
                        width: '100%',
                      }}
                    >
                      {language['CLOSE']}
                    </CustomButton>
                  ) : (
                    <CustomButton
                      onClick={() => handleCloseDialog()}
                      styled={theme}
                      style={{
                        backgroundColor: `${theme.color.error}22`,
                        color: theme.color.error,
                        width: '100%',
                      }}
                    >
                      {language['CLOSE']}
                    </CustomButton>
                  )}
                  {payment?.status ? (
                    <>
                      <CustomButton
                        isLoading={isLoading}
                        onClick={handlePrint}
                        styled={theme}
                        style={{
                          backgroundColor: `${theme.color.info}22`,
                          color: theme.color.info,
                          width: '100%',
                        }}
                      >
                        <PrintRoundedIcon
                          style={{ fontSize: 19, marginRight: 5 }}
                        />{' '}
                        {language['PRINT_RECEIPT']}
                      </CustomButton>
                      {user?.privilege?.queue?.create && <CustomButton
                        isLoading={isLoading}
                        onClick={handleAddToQueue}
                        styled={theme}
                        style={{
                          backgroundColor: queue ? `${theme.text.secondary}22` : `${theme.color.info}22`,
                          color: queue ? theme.text.secondary : theme.color.info,
                          width: '100%',
                        }}
                        disabled={queue}
                      >
                        <ConfirmationNumberRoundedIcon
                          style={{ fontSize: 19, marginRight: 5 }}
                        />{' '}
                        {queue ? language['ADDED_TO_QUEUE'] : language['ADD_TO_QUEUE']}
                      </CustomButton>}
                    </>
                  ) : (
                    <CustomButton
                      isLoading={isLoading}
                      onClick={handleCheckout}
                      styled={theme}
                      style={{
                        backgroundColor: `${theme.color.success}22`,
                        color: theme.color.success,
                        width: '100%',
                      }}
                    >
                      <ReceiptRoundedIcon
                        style={{ fontSize: 17, marginRight: 5 }}
                      />{' '}
                      {language['CHECKOUT']}
                    </CustomButton>
                  )}
                </div>
              )}
            </div>
          </Box>
          <div style={{ gridArea: 'preview' }}>
            <div style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dialog.payments?.map((p) => (
                <InvoicePreview key={p._id} payment={p} customer={dialog.customer} onRemove={handleRemovePayment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AlertContainer>
  )
})

const CashReturn = ({ cash }) => (
  <div className='cash'>
    <span>{currencyFormat(parseFloat(cash.cash), cash.currency)}</span>
    {cash.exchange && (
      <span>({currencyFormat(parseFloat(cash.exchange), 'KHR')})</span>
    )}
    <span style={{ marginLeft: 5 }}>x{cash.quantity}</span>
  </div>
)


export default GroupPaymentDialog
