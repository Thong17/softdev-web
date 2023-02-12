import { Box } from '@mui/system'
import { ExchangeRate } from 'components/shared/ExchangeRate'
import { CashForm } from 'components/shared/form/CashForm'
import { SelectTab } from 'components/shared/form/SelectTab'
import useTheme from 'hooks/useTheme'
import React, {
  forwardRef,
  ReactChild,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { CustomButton } from 'styles'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'
import { currencyFormat } from 'utils'
import useAuth from 'hooks/useAuth'
import { IDrawer } from 'contexts/auth/interface'
import useWeb from 'hooks/useWeb'
import { CarouselContainer } from 'components/shared/container/CarouselContainer'
import {
  getListTransfer,
  selectListTransfer,
} from 'modules/organize/store/redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import useLanguage from 'hooks/useLanguage'
import { LoanForm } from 'components/shared/form/LoanForm'

export interface ICustomerInfo {
  id: string
  username: string
  phone?: string
}

export interface IPaymentInfo {
  _id: string
  total: {
    value: number
    currency: string
  }
  rate: IDrawer
  status: boolean
  returnCashes: any[]
  remainTotal: {
    USD: number
    KHR: number
  }
  customer?: ICustomerInfo
}

declare type PaymentMethod = 'cash' | 'transfer' | 'loan'

export interface IPaymentForm {
  paymentInfo: IPaymentInfo | null
  paymentType: Array<PaymentMethod>
  children: ReactChild
  onClear: () => void
  onClose: () => void
  onCheckout: (data) => void
  onPrint: (data) => void
  onAddToQueue?: (data) => void
}

export const PaymentForm = forwardRef(
  (
    {
      paymentInfo,
      paymentType,
      children,
      onClear,
      onClose,
      onCheckout,
      onPrint,
      onAddToQueue,
    }: IPaymentForm,
    ref
  ) => {
    const { theme } = useTheme()
    const { language } = useLanguage()
    const { width } = useWeb()
    const { user } = useAuth()
    const [totalReceive, setTotalReceive] = useState({
      KHR: 0,
      USD: 0,
      total: 0,
    })
    const [totalRemain, setTotalRemain] = useState({ KHR: 0, USD: 0 })
    const [payment, setPayment] = useState<IPaymentInfo | null>(null)
    const [queue, setQueue] = useState<any>(null)
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [totalPayment, setTotalPayment] = useState({
      value: 0,
      currency: 'USD',
    })
    const [exchangeRate, setExchangeRate] = useState<null | IDrawer>(null)
    const [receiveCashes, setReceiveCashes] = useState([])
    const { data: listTransfer } = useAppSelector(selectListTransfer)
    const dispatch = useAppDispatch()

    const paymentMethods = [
      { label: language['CASH'], value: 'cash' },
      { label: language['TRANSFER'], value: 'transfer' },
      { label: language['LOAN'], value: 'loan' },
    ].filter((item) => paymentType.includes(item.value as PaymentMethod))

    useEffect(() => {
      dispatch(getListTransfer())
    }, [dispatch])

    useImperativeHandle(ref, () => ({
      callClearPayment() {
        onClearPayment()
      },
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
      setPayment(paymentInfo)
      const value =
        paymentInfo?.total.currency === 'KHR'
          ? paymentInfo?.total.value / paymentInfo?.rate.sellRate
          : paymentInfo?.total.value
      setTotalPayment((prev) => ({ ...prev, value: value || 0 }))
      setExchangeRate(paymentInfo?.rate || null)
    }, [paymentInfo])

    useEffect(() => {
      const remainUSD = totalPayment.value - totalReceive.total
      const sellRate = exchangeRate?.sellRate || 4000
      setTotalRemain({ USD: remainUSD, KHR: remainUSD * sellRate })
    }, [totalPayment, exchangeRate, totalReceive.total])

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

    const loanButtonRef = useRef(document.createElement('button'))
    const renderPaymentMethod = (method) => {
      switch (method) {
        case 'transfer':
          return (
            <CarouselContainer
              images={listTransfer?.map((item) => item.image) || []}
            />
          )

        case 'loan': {
          const body = {
            receiveCashes,
            totalPaid: totalReceive,
            totalRemain: totalRemain,
          }
          return (
            <LoanForm
              onChange={handleChangeCashes}
              loanButtonRef={loanButtonRef}
              paymentId={paymentInfo?._id}
              payment={body}
              onCheckoutLoan={(data) => onCheckout({ ...data, paymentMethod })}
            />
          )
        }

        default:
          return <CashForm onChange={handleChangeCashes} />
      }
    }

    return (
      <div
        style={{
          height: '100vh',
          width: 'calc(100vw - 64px)',
          boxSizing: 'border-box',
          position: 'relative',
          color: theme.text.secondary
        }}
      >
        <div
          style={{
            padding: '10px 20px 20px 20px',
            boxSizing: 'border-box',
            height: '100%',
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
                    {payment?.remainTotal?.USD
                      ? payment?.remainTotal?.USD < 0
                        ? language['RETURN']
                        : language['REMAIN']
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
                        onClick={() => onClear()}
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
                        onClick={() => onPrint({ ...payment, type: 'loan' })}
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
                        onClick={() => onClose()}
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
                      onClick={() => onClear()}
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
                      onClick={() => onClose()}
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
                        onClick={() => onPrint(payment)}
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
                      {user?.privilege?.queue?.create && onAddToQueue && (
                        <CustomButton
                          onClick={() => onAddToQueue(payment)}
                          styled={theme}
                          style={{
                            backgroundColor: !!queue
                              ? `${theme.text.secondary}22`
                              : `${theme.color.info}22`,
                            color: !!queue
                              ? theme.text.secondary
                              : theme.color.info,
                            width: '100%',
                          }}
                          disabled={!!queue}
                        >
                          <ConfirmationNumberRoundedIcon
                            style={{ fontSize: 19, marginRight: 5 }}
                          />{' '}
                          {!!queue
                            ? language['ADDED_TO_QUEUE']
                            : language['ADD_TO_QUEUE']}
                        </CustomButton>
                      )}
                    </>
                  ) : (
                    <CustomButton
                      disabled={!payment}
                      onClick={() =>
                        onCheckout({
                          ...payment,
                          receiveCashes,
                          receiveTotal: totalReceive,
                          remainTotal: totalRemain,
                          paymentMethod,
                        })
                      }
                      styled={theme}
                      style={{
                        backgroundColor: payment
                          ? `${theme.color.success}22`
                          : `${theme.text.secondary}22`,
                        color: payment
                          ? theme.color.success
                          : theme.text.secondary,
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
          <div style={{ gridArea: 'preview', minHeight: '500px' }}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

const CashReturn = ({ cash }) => (
  <div className='cash'>
    <span>{currencyFormat(parseFloat(cash.cash), cash.currency)}</span>
    {cash.exchange && (
      <span>({currencyFormat(parseFloat(cash.exchange), 'KHR')})</span>
    )}
    <span style={{ marginLeft: 5 }}>x{cash.quantity}</span>
  </div>
)
