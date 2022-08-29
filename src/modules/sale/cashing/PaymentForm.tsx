import { AlertContainer } from 'components/shared/container/AlertContainer'
import { DialogTitle } from 'components/shared/DialogTitle'
import { CashForm } from 'components/shared/form/CashForm'
import { SelectTab } from 'components/shared/form/SelectTab'
import { InvoicePreview } from 'components/shared/preview/InvoicePreview'
import useTheme from 'hooks/useTheme'
import React from 'react'

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
            display: 'grid',
            gridTemplateColumns: 'calc(100% - 480px) auto',
            gridTemplateAreas: `'cash invoice'`,
            padding: '10px 20px 20px 20px',
            boxSizing: 'border-box',
            height: 'calc(100% - 69.98px)',
            gridGap: 20,
          }}
        >
          <div
            style={{
              gridArea: 'cash',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div
              className='payment'
              style={{ borderRadius: theme.radius.ternary, position: 'relative', boxSizing: 'border-box' }}
            >
              <div
                style={{
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 5px',
                }}
              >
                <SelectTab
                  options={paymentMethods}
                  onChange={handleChangeTab}
                />
              </div>
              <div
                style={{
                  border: theme.border.dashed,
                  borderRadius: theme.radius.ternary,
                  height: 'calc(100% - 36px)',
                  position: 'relative',
                  boxSizing: 'border-box',
                  padding: 10,
                }}
              >
                <CashForm
                  onChange={(value) => {
                    console.log(value)
                  }}
                />
              </div>
            </div>
            <div
              className='exchange'
              style={{
                background: `linear-gradient(0deg, ${theme.background.secondary}cc, ${theme.background.secondary}bb)`,
                height: 200,
                borderRadius: theme.radius.ternary,
              }}
            ></div>
          </div>
          <div style={{ gridArea: 'invoice' }}>
            <InvoicePreview />
          </div>
        </div>
      </div>
    </AlertContainer>
  )
}
