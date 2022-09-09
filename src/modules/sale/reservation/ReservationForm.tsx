import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { initCustomer } from './InvoiceForm'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Cashing } from './Cashing'
import { getDetailReservation, selectDetailReservation } from './redux'

export const ReservationForm = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectDetailReservation)
  const [defaultValue, setDefaultValue] = useState({ id: id, transactions: [], customer: initCustomer, reservation: data })

  useEffect(() => {
    if (!id) return
    dispatch(getDetailReservation({ id }))
  }, [id, dispatch])

  const handleReloadReservation = () => {
    if (!id) return
    dispatch(getDetailReservation({ id }))
  }

  useEffect(() => {
    if (!data) return
    setDefaultValue(prev => ({ ...prev, transactions: data.payment?.transactions, customer: { ...data.customer, id: data.customer?._id }, reservation: data, }))
  }, [data])
  
  return (
    <Container>
      <Cashing customer={defaultValue.customer} id={defaultValue.reservation?.payment?._id} transactions={defaultValue.transactions} reservationData={defaultValue.reservation} onReload={handleReloadReservation} />
    </Container>
  )
}
