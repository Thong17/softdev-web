import Container from 'components/shared/Container'
import { initCustomer } from './InvoiceForm'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Cashing } from './Cashing'
import { getDetailReservation } from './redux'
import useNotify from 'hooks/useNotify'

export const ReservationForm = () => {
  const { id } = useParams()
  const { notify } = useNotify()
  const [defaultValue, setDefaultValue] = useState<any>({ id: id, transactions: [], customer: initCustomer, reservation: null })

  useEffect(() => {
    if (!id) return
    getDetailReservation({ id })
      .then(response => {
        if (response.code !== 'SUCCESS') return
        const data = response.data
        setDefaultValue(prev => ({ ...prev, transactions: data.payment?.transactions, customer: { ...data.customer, id: data.customer?._id }, reservation: data, }))
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
      // eslint-disable-next-line
  }, [id])

  const handleReloadReservation = () => {
    if (!id) return
    getDetailReservation({ id })
      .then(response => {
        if (response.code !== 'SUCCESS') return
        const data = response.data
        setDefaultValue(prev => ({ ...prev, transactions: data.payment?.transactions, customer: { ...data.customer, id: data.customer?._id }, reservation: data, }))
      })
      .catch(err => notify(err?.response?.data?.msg, 'error'))
  }
  
  return (
    <Container>
      <Cashing customer={defaultValue.customer} id={defaultValue.reservation?.payment?._id} transactions={defaultValue.transactions} reservationData={defaultValue.reservation} onReload={handleReloadReservation} />
    </Container>
  )
}
