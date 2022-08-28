import { AlertContainer } from 'components/shared/container/AlertContainer'
import { DialogTitle } from 'components/shared/DialogTitle'
import { SelectTab } from 'components/shared/form/SelectTab'
import { InvoicePreview } from 'components/shared/preview/InvoicePreview'
import useTheme from 'hooks/useTheme'
import React from 'react'

const paymentMethods = [{ label: 'Cash', value: 'cash' }, { label: 'KHQR', value: 'transfer' }, { label: 'Loan', value: 'loan' }]

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
            gridTemplateColumns: '1fr auto',
            gridTemplateAreas: `'cash invoice'`,
            padding: '10px 20px 20px 20px',
            boxSizing: 'border-box',
            height: 'calc(100% - 69.98px)',
            gridGap: 20
          }}
        >
          <div style={{ gridArea: 'cash', display: 'flex' , flexDirection: 'column', gap: 20 }}>
            <div className="payment" style={{ height: '100%', borderRadius: theme.radius.ternary }}>
              <div style={{ height: 30, display: 'flex', alignItems: 'center', padding: '0 5px' }}>
                <SelectTab options={paymentMethods} onChange={handleChangeTab} />
              </div>
              <div style={{ border: theme.border.dashed, borderRadius: theme.radius.ternary, height: 'calc(100% - 30px)', position: 'relative', boxSizing: 'border-box' }}>
                
              </div>
            </div>
            <div className="exchange" style={{ background: `linear-gradient(0deg, ${theme.background.secondary}cc, ${theme.background.secondary}bb)`, height: 300, borderRadius: theme.radius.ternary }}></div>
          </div>
          <div style={{ gridArea: 'invoice' }}>
            <InvoicePreview />
          </div>
        </div>
      </div>
    </AlertContainer>
  )
}
