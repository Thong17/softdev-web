import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { initCustomer } from 'components/shared/form/InvoiceForm'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Cashing } from '../cashing'
import { getDetailReservation, selectDetailReservation } from './redux'

export const ReservationForm = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectDetailReservation)
  const [defaultValue, setDefaultValue] = useState({ id: id, transactions: [], customer: initCustomer, status: null })

  useEffect(() => {
    if (!id) return
    dispatch(getDetailReservation({ id }))
  }, [id, dispatch])

  useEffect(() => {
    if (!data) return
    setDefaultValue(prev => ({ ...prev, transactions: data.payment?.transactions, customer: { ...data.payment?.customer, id: data.payment?.customer?._id }, status: data.status }))
  }, [data])
  
  return (
    <Container>
      <Cashing customer={defaultValue.customer} id={defaultValue.id} transactions={defaultValue.transactions} status={defaultValue.status} />
    </Container>
  )
}
