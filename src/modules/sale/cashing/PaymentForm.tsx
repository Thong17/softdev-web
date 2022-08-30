import { Box } from '@mui/system'
import { AlertContainer } from 'components/shared/container/AlertContainer'
import { DialogTitle } from 'components/shared/DialogTitle'
import { ExchangeRate } from 'components/shared/ExchangeRate'
import { CashForm } from 'components/shared/form/CashForm'
import { SelectTab } from 'components/shared/form/SelectTab'
import { InvoicePreview } from 'components/shared/preview/InvoicePreview'
import useTheme from 'hooks/useTheme'
import React from 'react'
import { CustomButton } from 'styles'
import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded'

const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'KHQR', value: 'transfer' },
  { label: 'Loan', value: 'loan' },
]

export const PaymentForm = ({ dialog, setDialog }: any) => {
  const { theme } = useTheme()

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

  const handleChangeTab = (value) => {
    console.log(value)
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
                height: '100%'
              }}
            >
              <CashForm
                onChange={(value) => {
                  console.log(value)
                }}
              />
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
                backgroundColor: `${theme.background.primary}99`, width: '100%', borderRadius: theme.radius.ternary 
              },
              '& .total-receive': {
                height: 50,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 20px',
                boxSizing: 'border-box'
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
                  width: 'calc(100% - 20px)'
                }
              }
            }}
          >
            <div className='total-receive'>
              <span>Receive Total</span>
              <div style={{ display: 'flex', lineHeight: 1 }}>
                <span>50$ + 200000R = 100$</span>
              </div>
            </div>
            <div className='total-payment'>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px' }}>
                <span>Remain Total</span>
                <div style={{ display: 'flex', lineHeight: 1 }}>
                  <span>50$ (200000R)</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <CustomButton styled={theme} style={{ backgroundColor: `${theme.color.info}22`, color: theme.color.info, width: '100%' }}><PrintRoundedIcon style={{ fontSize: 19, marginRight: 5 }} /> Print</CustomButton>
                <CustomButton styled={theme} style={{ backgroundColor: `${theme.color.success}22`, color: theme.color.success, width: '100%' }}><ReceiptRoundedIcon style={{ fontSize: 17, marginRight: 5 }} /> Check out</CustomButton>
              </div>
            </div>
          </Box>
          <div style={{ gridArea: 'preview' }}>
            <InvoicePreview />
          </div>
        </div>
      </div>
    </AlertContainer>
  )
}
