import { DialogTitle } from 'components/shared/DialogTitle'
import { IPaymentInfo, PaymentForm } from 'components/shared/form/PaymentForm'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import useLanguage from 'hooks/useLanguage'
import { useEffect, useState } from 'react'

export const DepositDialog = ({ dialog, setDialog }: any) => {
  const [paymentInfo, setPaymentInfo] = useState<IPaymentInfo | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    if (!dialog?.payment) return
    setPaymentInfo(dialog?.payment)
  }, [dialog?.payment])

  const handleCloseDialog = () => {
    setDialog({ open: false, payment: null })
  }

  const handleClearPayment = () => {
    console.log('clear payment')
  }

  const handleCheckoutPayment = (data) => {
    console.log(data)
  }

  const handlePrintPayment = (data) => {
    console.log(data)
  }

  const handleAddToQueue = (data) => {
    console.log(data)
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle
        title={language['DEPOSIT_LOAN']}
        onClose={handleCloseDialog}
      />
      <PaymentForm
        paymentInfo={paymentInfo}
        paymentType={['cash', 'transfer']}
        onClear={handleClearPayment}
        onClose={handleCloseDialog}
        onCheckout={handleCheckoutPayment}
        onPrint={handlePrintPayment}
        onAddToQueue={handleAddToQueue}
      />
    </AlertDialog>
  )
}
