import { Box } from '@mui/system'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { DialogTitle } from 'components/shared/DialogTitle'
import { ExchangeRate } from 'components/shared/ExchangeRate'
import { CashForm } from 'components/shared/form/CashForm'
import { SelectTab } from 'components/shared/form/SelectTab'
import { InvoicePreview } from 'components/shared/preview/InvoicePreview'
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
import { PaymentReceipt } from 'components/shared/invoice/PaymentReceipt'
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
import { QueueReceipt } from 'components/shared/invoice/QueueReceipt'
import { PreviewLoan } from 'components/shared/invoice/PreviewLoan'
import { directPrinting } from 'api/receipt.api'
import * as qz from 'qz-tray'

export const PaymentForm = forwardRef(({ dialog, setDialog, onClear, onCheckout }: any, ref) => {
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
  const [loanPreview, setLoanPreview] = useState(null);
  const [loanInfo, setLoanInfo] = useState(null);
  const [formMode, setFormMode] = useState('pending');
  const { data: storeInfo, status } = useAppSelector(selectStore)

  const paymentMethods = [
    { label: language['CASH'], value: 'cash' },
    { label: language['TRANSFER'], value: 'transfer' },
    // { label: language['LOAN'], value: 'loan' },
  ]

  useEffect(() => {
    // Connect to the local QZ Tray service when the component mounts
    if (!qz.websocket.isActive()) {
      qz.websocket.connect().catch(err => console.error("QZ Tray connection failed:", err));
    }
    return () => {
      // Optional: clean up connection on unmount if desired
    };
  }, []);

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
          receiveCashes,
          receiveTotal: totalReceive,
          remainTotal: totalRemain,
          customer: dialog.customer?.id,
          paymentMethod,
        }
        Axios({
          method: 'PUT',
          url: `/sale/payment/checkout/${dialog.payment?._id}`,
          body,
        })
          .then((data) => {
            setPayment(data?.data?.data)
            reload()
            onCheckout()
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

  const printType: string = 'web_printing'

  const invoiceRef = useRef(document.createElement('div'))
  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceRef?.current,
    documentTitle: 'Invoice',
  })

  const handleThermalPrint = async (data: { items: { description: string; qty: number, options: { name: string, value: string }[] }[], createdAt: string, invoice: string }) => {
    try {
      // 1. Find your printer by its Windows name
      const config = qz.configs.create("Gprinter GP-2270T");

      // 2. For each item, print as many labels as the quantity
      for (const item of data.items || []) {
        // sanitize description to avoid breaking TSPL string quoting
        const desc = (item.description || '').toString().replace(/"/g, "'");
        for (let i = 0; i < (item.qty || 0); i++) {
          const optionsText = item.options?.map((option, index) => `
            TEXT 70,${110 + index * 30},"2",0,1,1,"- ${option.name}: ${option.value}"\r\n
            `)
          const tsplData = [
            'SIZE 52 mm, 126 mm\r\n',
            'GAP 2 mm, 0 mm\r\n',
            'DENSITY 1\r\n',
            'CLS\r\n',
            // use built-in font index (e.g. "3") instead of external TTF file
            // invoice/timestamp below item description
            `TEXT 50,20,"2",0,1,1,"${(data.createdAt || '')}"\r\n`,
            `TEXT 50,50,"2",0,1,1,"#${(data.invoice || '')}"\r\n`,
            `TEXT 50,80,"2",0,1,1,"${desc}"\r\n`,
            ...(optionsText || []),
            // move barcode lower so it doesn't overlap text and reduce its height
            'PRINT 1,1\r\n',
          ];

          // send each label to the printer sequentially
          await qz.print(config, tsplData);
        }
      }

      console.log("Labels printed instantly!");
    } catch (error) {
      console.error("Printing failed:", error);
    }
  };

  const handleReceiptPrint = async (data: { items: { description: string; qty: number, options: { name: string, value: string }[] }[], createdAt: string, invoice: string }) => {
    try {
      // 1. Find your printer by its Windows name
      const config = qz.configs.create("POS80 Printer");

      // 2. For each item, print as many labels as the quantity
      for (const item of data.items || []) {
        // sanitize description to avoid breaking TSPL string quoting
        const desc = (item.description || '').toString().replace(/"/g, "'");
        for (let i = 0; i < (item.qty || 0); i++) {
          const optionsText = item.options?.map((option, index) => `
            TEXT 70,${110 + index * 30},"2",0,1,1,"- ${option.name}: ${option.value}"\r\n
            `)
          const tsplData = [
            'SIZE 52 mm, 126 mm\r\n',
            'GAP 2 mm, 0 mm\r\n',
            'DENSITY 1\r\n',
            'CLS\r\n',
            // use built-in font index (e.g. "3") instead of external TTF file
            // invoice/timestamp below item description
            `TEXT 50,20,"2",0,1,1,"${(data.createdAt || '')}"\r\n`,
            `TEXT 50,50,"2",0,1,1,"#${(data.invoice || '')}"\r\n`,
            `TEXT 50,80,"2",0,1,1,"${desc}"\r\n`,
            ...(optionsText || []),
            // move barcode lower so it doesn't overlap text and reduce its height
            'PRINT 1,1\r\n',
          ];

          // send each label to the printer sequentially
          await qz.print(config, tsplData);
        }
      }

      console.log("Labels printed instantly!");
    } catch (error) {
      console.error("Printing failed:", error);
    }
  };

  const handlePrint = () => {
      if (printType === 'network_printing') {
        setIsLoading(true)
        directPrinting({
            name: storeInfo?.name,
            invoice: dialog.payment?.invoice,
            cashier: dialog.payment?.createdBy?.username,
            createdAt: timeFormat(dialog.payment?.createdAt, 'YYYY-MM-DD HH:mm'),
            transactions: dialog.payment?.transactions?.map(item => ({
                item: item.description,
                qty: item.quantity,
                disc: currencyFormat(item.discount?.value, item.discount?.type, 0, true) + (item.discount?.isFixed ? ' Fixed' : ''),
                price: currencyFormat(item.price, item.currency, 0, true),
            })),
            subtotal: currencyFormat(dialog.payment?.subtotal?.USD, 'USD', 0, true),
            discount: currencyFormat(dialog.payment?.discounts[0]?.value, dialog.payment?.discounts[0]?.type, 0, true) + (dialog.payment?.discounts[0]?.isFixed ? ' Fixed' : ''),
            tax: currencyFormat(dialog.payment?.services[0]?.value, dialog.payment?.services[0]?.type, 0, true),
            total: currencyFormat(dialog.payment?.total?.value, dialog.payment?.total?.currency, 0, true),
            address: storeInfo?.address,
            footer: storeInfo?.other
        }, 'USB', 'thermal')
            .then(console.log)
            .catch(handlePrintInvoice)
            .finally(() => setIsLoading(false))
      } else {
          handleThermalPrint({
            items: dialog.payment?.transactions?.map(item => ({
              description: item.description,
              qty: item.quantity,
              options: item.options?.map(option => ({
                name: option.property?.name?.English,
                value: option.name?.English
              }))
            })) || [],
            createdAt: timeFormat(dialog.payment?.createdAt, 'YYYY-MM-DD HH:mm'),
            invoice: dialog.payment?.invoice
          })
          handleReceiptPrint({
            items: dialog.payment?.transactions?.map(item => ({
              description: item.description,
              qty: item.quantity,
              options: item.options?.map(option => ({
                name: option.property?.name?.English,
                value: option.name?.English
              }))
            })) || [],
            createdAt: timeFormat(dialog.payment?.createdAt, 'YYYY-MM-DD HH:mm'),
            invoice: dialog.payment?.invoice
          })
      }
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
    setLoanPreview(data)
    setLoanInfo({...body, totalPayment, totalReceive, totalRemain})
    printPreview()
  }

  const handleCheckoutLoan = (data) => {
    setPayment(data)
    reload()
    onCheckout()
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
        <DialogTitle title={language['PAYMENT']} onClose={handleCloseDialog} />
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
                selected={paymentMethod || paymentMethods[0]?.value}
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
                        onClick={handleClearPayment}
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
                        onClick={handlePrintPreview}
                        styled={theme}
                        style={{
                          backgroundColor: `${theme.color.info}22`,
                          color: theme.color.info,
                          width: '100%',
                        }}
                      >
                        <PrintRoundedIcon
                          style={{ fontSize: 19, marginRight: 5 }}
                        />
                        {language['PRINT']}
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
                      onClick={handleClearPayment}
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
                        {language['PRINT']}
                      </CustomButton>
                      {user?.privilege?.queue?.create && <CustomButton
                        isLoading={isLoading}
                        onClick={handleAddToQueue}
                        styled={theme}
                        style={{
                          backgroundColor: !!queue ? `${theme.text.secondary}22` : `${theme.color.info}22`,
                          color: !!queue ? theme.text.secondary : theme.color.info,
                          width: '100%',
                        }}
                        disabled={!!queue}
                      >
                        <ConfirmationNumberRoundedIcon
                          style={{ fontSize: 19, marginRight: 5 }}
                        />{' '}
                        {!!queue ? language['ADDED_TO_QUEUE'] : language['ADD_TO_QUEUE']}
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
            <InvoicePreview payment={payment} customer={dialog.customer} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '200%', width: '100%' }}>
        <div ref={invoiceRef}>
          <PaymentReceipt payment={payment} />
        </div>
        <div ref={ticketRef}>
          <QueueReceipt info={queue} />
        </div>
        <div ref={previewRef}>
          <PreviewLoan loanPreview={loanPreview} loanInfo={loanInfo} />
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
