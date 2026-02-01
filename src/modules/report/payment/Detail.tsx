import { PaymentInvoice } from 'components/shared/invoice/PaymentInvoice'
import { PaymentReceipt } from 'components/shared/invoice/PaymentReceipt'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import useLanguage from 'hooks/useLanguage'
import { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { CustomDetailContainer } from 'styles/container'
import { CustomButton } from 'styles/index'

export const Detail = ({
  theme,
  dialog,
  setDialog,
 }: any) => {
  const [payment, setPayment] = useState(null)
  const { language } = useLanguage()
  
  const handleCloseDialog = () => {
    setDialog({ ...dialog, stockId: null, open: false })
  }

  const invoiceRef = useRef(document.createElement('div'))
  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceRef?.current,
    documentTitle: 'Invoice',
  })

  useEffect(() => {
    setPayment(dialog?.payment)
  }, [dialog?.payment])

  return (
    <AlertDialog
      isOpen={dialog.open}
      handleClose={handleCloseDialog}
    >
      <div style={{ position: 'fixed', top: '-200%' }}>
        <div ref={invoiceRef}>
          <PaymentReceipt payment={payment} />
        </div>
      </div>
      <CustomDetailContainer styled={theme}>
        <PaymentInvoice payment={payment} />
        <div style={{ display: 'flex', gap: 10, padding: 10 }}>
          <CustomButton
            onClick={handleCloseDialog}
            styled={theme}
            style={{
              borderRadius: theme.radius.secondary,
              backgroundColor: `${theme.color.error}22`,
              color: theme.color.error,
              width: '100%',
            }}
          >
            {language['CLOSE']}
          </CustomButton>
          <CustomButton
            onClick={() => handlePrintInvoice()}
            styled={theme}
            style={{
              borderRadius: theme.radius.secondary,
              backgroundColor: `${theme.color.info}22`,
              color: theme.color.info,
              width: '100%',
            }}
          >
            {language['PRINT']}
          </CustomButton>
        </div>
      </CustomDetailContainer>
    </AlertDialog>
  )
}
