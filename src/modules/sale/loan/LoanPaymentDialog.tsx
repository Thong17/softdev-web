import { useAppDispatch } from 'app/hooks'
import { DialogTitle } from 'components/shared/DialogTitle'
import { IPaymentInfo, PaymentForm } from 'components/shared/form/PaymentForm'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import Axios from 'constants/functions/Axios'
import useAlert from 'hooks/useAlert'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { getDetailLoan } from './redux'

export const LoanPaymentDialog = ({ dialog, setDialog }: any) => {
  const [paymentInfo, setPaymentInfo] = useState<IPaymentInfo | null>(null)
  const { language } = useLanguage()
  const confirm = useAlert()
  const { notify } = useNotify()
  const dispatch = useAppDispatch()

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
    const id = data?._id
    if (!id) return
    if (data.remainTotal.USD > 0) {
      notify('Not enough cash', 'error')
    } else {
      confirm({
        title: 'Are you sure you want to check out?',
        description: 'Checkout the payment will update the status to complete.',
        variant: 'info',
      })
        .then(() => {
          const body = {
            total: data.total,
            receiveCashes: data.receiveCashes,
            receiveTotal: data.receiveTotal,
            remainTotal: data.remainTotal,
            paymentMethod: data.paymentMethod,
          }
          Axios({
            method: 'PUT',
            url: `/sale/loan/payment/${id}`,
            body,
          })
            .then((data) => {
              const respData: any = data?.data?.data
              if (!respData) return
              setPaymentInfo({ ...paymentInfo, returnCashes: respData.returnCashes, status: true } as any)
              dispatch(getDetailLoan(dialog?.detail?.loan))
            })
            .catch((err) => {
              notify(err?.response?.data?.msg, 'error')
            })
        })
        .catch(() => null)
    }
  }

  const handlePrintPayment = (data) => {
    console.log(data)
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <DialogTitle
        title={language['LOAN_PAYMENT']}
        onClose={handleCloseDialog}
      />
      <PaymentForm
        paymentInfo={paymentInfo}
        paymentType={['cash', 'transfer']}
        onClear={handleClearPayment}
        onClose={handleCloseDialog}
        onCheckout={handleCheckoutPayment}
        onPrint={handlePrintPayment}
      >
        <div>Hello</div>
      </PaymentForm>
    </AlertDialog>
  )
}
