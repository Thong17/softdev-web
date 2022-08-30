import { Box } from '@mui/system'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { DialogTitle } from 'components/shared/DialogTitle'
import { ExchangeRate } from 'components/shared/ExchangeRate'
import { CashForm } from 'components/shared/form/CashForm'
import { SelectTab } from 'components/shared/form/SelectTab'
import { InvoicePreview } from 'components/shared/preview/InvoicePreview'
import useTheme from 'hooks/useTheme'
import React, { useEffect, useState } from 'react'
import { CustomButton } from 'styles'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded'
import { currencyFormat } from 'utils'
import useAuth from 'hooks/useAuth'
import { IDrawer } from 'contexts/auth/interface'

const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'KHQR', value: 'transfer' },
  { label: 'Loan', value: 'loan' },
]

export const PaymentForm = ({ dialog, setDialog }: any) => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [totalReceive, setTotalReceive] = useState({ KHR: 0, USD: 0, total: 0 })
  const [totalRemain, setTotalRemain] = useState({ KHR: 0, USD: 0 })
  const [payment, setPayment] = useState<any>(null)
  const [totalPayment, setTotalPayment] = useState({
    value: 0,
    currency: 'USD',
  })
  const [exchangeRate, setExchangeRate] = useState<null | IDrawer>(null)

  useEffect(() => {
    setPayment(dialog.payment)
    const value =
      dialog.payment?.total.currency === 'KHR'
        ? dialog.payment?.total.value / dialog.payment?.rate.sellRate
        : dialog.payment?.total.value
    setTotalPayment((prev) => ({ ...prev, value }))
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

  const handleChangeTab = (value) => {
    console.log(value)
  }

  const handleChangeCashes = (cashes) => {
    let totalUSD = 0
    let totalKHR = 0

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
        <DialogTitle title='Payment' onClose={handleCloseDialog} />
        <div
          style={{
            padding: '10px 20px 20px 20px',
            boxSizing: 'border-box',
            height: 'calc(100% - 69.98px)',
            gridGap: 20,
            display: 'grid',
            gridTemplateColumns: 'calc(100% - 480px) auto',
            gridTemplateRows: '1fr 200px',
            gridTemplateAreas: `'payment preview''exchange preview'`,
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
              <SelectTab options={paymentMethods} onChange={handleChangeTab} />
              <ExchangeRate />
            </div>
            <div
              style={{
                border: theme.border.dashed,
                borderRadius: theme.radius.ternary,
                position: 'relative',
                boxSizing: 'border-box',
                padding: 10,
                height: '100%',
              }}
            >
              <CashForm onChange={handleChangeCashes} />
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
              <span>Receive Total</span>
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '5px 10px',
                }}
              >
                <span>Remain Total</span>
                <div style={{ display: 'flex', lineHeight: 1 }}>
                  <span>
                    {currencyFormat(totalRemain.USD, 'USD')} (
                    {currencyFormat(totalRemain.KHR, 'KHR')})
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <CustomButton
                  styled={theme}
                  style={{
                    backgroundColor: `${theme.color.error}22`,
                    color: theme.color.error,
                    width: '100%',
                  }}
                >
                  Close
                </CustomButton>
                {payment?.status ? (
                  <CustomButton
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
                    Print
                  </CustomButton>
                ) : (
                  <CustomButton
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
                    Check out
                  </CustomButton>
                )}
              </div>
            </div>
          </Box>
          <div style={{ gridArea: 'preview' }}>
            <InvoicePreview payment={payment} />
          </div>
        </div>
      </div>
    </AlertContainer>
  )
}
