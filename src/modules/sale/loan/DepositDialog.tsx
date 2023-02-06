import LoanDetail from 'components/shared/container/LoanDetail'
import { DialogTitle } from 'components/shared/DialogTitle'
import { IPaymentInfo, PaymentForm } from 'components/shared/form/PaymentForm'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'

export const DepositDialog = ({ dialog, setDialog }: any) => {
  const [paymentInfo, setPaymentInfo] = useState<IPaymentInfo | null>(null)
  const [paymentDetail, setPaymentDetail] = useState<any>(null)
  const { language } = useLanguage()
  const { theme } = useTheme()

  useEffect(() => {
    if (!dialog?.payment) return
    setPaymentInfo(dialog?.payment)
  }, [dialog?.payment])

  useEffect(() => {
    if (!dialog?.detail) return
    setPaymentDetail(dialog?.detail)
  }, [dialog?.detail])

  const handleCloseDialog = () => {
    setDialog({ open: false, payment: null })
  }

  const handleClearPayment = () => {
    console.log('clear payment')
  }

  const handleCheckoutPayment = (data) => {
    if (data.remainTotal.USD > 0) {
      console.log('not enough')
    } else {
      console.log(data)
    }
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
      >
        <LoanDetail
          direction='column'
          data={paymentDetail}
          backgroundColor={`${theme.background.secondary}77`}
        />
      </PaymentForm>
    </AlertDialog>
  )
}
