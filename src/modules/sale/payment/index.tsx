import { useAppDispatch, useAppSelector } from 'app/hooks'
import Container from 'components/shared/Container'
import { initCustomer } from 'components/shared/form/InvoiceForm'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Cashing } from '../cashing'
import { getDetailPayment, selectDetailPayment } from './redux'

export const Payment = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectDetailPayment)
  const [defaultValue, setDefaultValue] = useState({ id: id, transactions: [], customer: initCustomer })

  useEffect(() => {
    if (!id) return
    dispatch(getDetailPayment({ id }))
  }, [id, dispatch])

  useEffect(() => {
    if (!data) return
    setDefaultValue(prev => ({ ...prev, transactions: data.transactions, customer: { ...data.customer, id: data.customer?._id } }))
  }, [data])
  
  return (
    <Container>
      <Cashing customer={defaultValue.customer} id={defaultValue.id} transactions={defaultValue.transactions} />
    </Container>
  )
}
