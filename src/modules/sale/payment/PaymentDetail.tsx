import Container from 'components/shared/Container'
import { initCustomer } from './InvoiceForm'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Cashing } from './Cashing'
import useNotify from 'hooks/useNotify'
import { getDetailPayment } from 'modules/report/payment/redux'

export const PaymentDetail = () => {
  const { id } = useParams()
  const { notify } = useNotify()
  const [defaultValue, setDefaultValue] = useState<any>({ id: id, transactions: [], customer: initCustomer, payment: null })

  useEffect(() => {
    if (!id) return
    getDetailPayment({ id })
      .then(response => {
        if (response.code !== 'SUCCESS') return
        const data = response.data
        setDefaultValue(prev => ({ ...prev, payment: data, transactions: data?.transactions, customer: { ...data?.customer, id: data?.customer?._id }, }))
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
      // eslint-disable-next-line
  }, [id])

  const handleReloadPayment = () => {
    if (!id) return
    getDetailPayment({ id })
      .then(response => {
        if (response.code !== 'SUCCESS') return
        const data = response.data
        setDefaultValue(prev => ({ ...prev, transactions: data?.transactions, customer: { ...data.customer, id: data.customer?._id }, }))
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
  }
  
  return (
    <Container>
      <Cashing customer={defaultValue.customer} id={defaultValue.payment?._id} paymentData={defaultValue.payment} transactions={defaultValue.transactions} onReload={handleReloadPayment} />
    </Container>
  )
}
