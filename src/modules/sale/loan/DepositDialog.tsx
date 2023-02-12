import { useAppDispatch } from 'app/hooks'
import { DialogTitle } from 'components/shared/DialogTitle'
import { IPaymentInfo, PaymentForm } from 'components/shared/form/PaymentForm'
import LoanInvoice from 'components/shared/invoice/LoanInvoice'
import { AlertDialog } from 'components/shared/table/AlertDialog'
import Axios from 'constants/functions/Axios'
import useAlert from 'hooks/useAlert'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import { useEffect, useState } from 'react'
import { getDetailLoan } from './redux'

export const DepositDialog = ({ dialog, setDialog }: any) => {
  const [paymentInfo, setPaymentInfo] = useState<IPaymentInfo | null>(null)
  const [paymentDetail, setPaymentDetail] = useState<any>(null)
  const [totalPenalty, setTotalPenalty] = useState(0)
  const [totalRemain, setTotalRemain] = useState(0)
  const { language } = useLanguage()
  const confirm = useAlert()
  const { notify } = useNotify()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!dialog?.detail?.loanPayments || !dialog?.detail?.prepayment || !dialog?.detail?.payment.rate) return
    setTotalPenalty(
      calculatePrepaymentPenalty(
        dialog?.detail?.loanPayments,
        dialog?.detail?.prepayment,
        dialog?.detail?.payment.rate
      )
    )
  }, [dialog?.detail?.loanPayments, dialog?.detail?.prepayment, dialog?.detail?.payment.rate])
  
  useEffect(() => {
    setTotalRemain(dialog?.detail?.totalRemain.USD)
  }, [dialog?.detail?.totalRemain.USD])

  useEffect(() => {
    if (!dialog?.payment) return
    const sellRate = dialog.payment.rate.sellRate
    const remainTotal = totalRemain + totalPenalty
    setPaymentInfo({ ...dialog?.payment, remainTotal: { USD: remainTotal, KHR: remainTotal * sellRate }, total: { value: remainTotal, currency: 'USD' } })
  }, [dialog?.payment, totalPenalty, totalRemain])

  useEffect(() => {
    if (!dialog?.detail) return
    setPaymentDetail(dialog?.detail)
  }, [dialog?.detail])

  const handleCloseDialog = () => {
    setDialog({ open: false, payment: null })
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
            customer: data.customer._id,
            paymentMethod: data.paymentMethod,
          }
          Axios({
            method: 'PUT',
            url: `/sale/loan/checkout/${id}`,
            body,
          })
            .then((data) => {
              const info = data?.data?.data
              setPaymentInfo(info)
              dispatch(getDetailLoan(id))
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
        title={language['DEPOSIT_LOAN']}
        onClose={handleCloseDialog}
      />
      <PaymentForm
        paymentInfo={paymentInfo}
        paymentType={['cash', 'transfer']}
        onClear={handleCloseDialog}
        onClose={handleCloseDialog}
        onCheckout={handleCheckoutPayment}
        onPrint={handlePrintPayment}
      >
        <LoanInvoice data={paymentDetail} totalPenalty={totalPenalty} totalRemain={totalRemain} />
      </PaymentForm>
    </AlertDialog>
  )
}

const calculatePrepaymentPenalty = (loanPayments, penalty, rate) => {
  switch (penalty.currency) {
    case 'USD':
      return penalty.value

    case 'KHR':
      return penalty.value / rate.sellRate

    default:
      let totalPenalty = 0
      loanPayments
        .filter((item) => !item.isPaid && !item.isDeleted)
        .forEach((item) => {
          totalPenalty += (item.principalBalance.value * penalty.value) / 100
        })
      return totalPenalty
  }
}
