import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from 'components/shared/Container'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import Breadcrumbs from '../components/Breadcrumbs'
import { CustomerProfileForm, initCustomer, toCustomerForm } from './Form'

export const CreateCustomer = () => {
  // Same object every render so the form isn't reset while typing
  const defaultValues = useMemo(() => ({ ...initCustomer }), [])
  return (
    <Container header={<Breadcrumbs page='customerCreate' />}>
      <CustomerProfileForm defaultValues={defaultValues} />
    </Container>
  )
}

export const UpdateCustomer = () => {
  const { id } = useParams()
  const { notify } = useNotify()
  const [customer, setCustomer] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    Axios({ method: 'GET', url: `/organize/customer/detail/${id}` })
      .then((response) => setCustomer(toCustomerForm(response?.data?.data)))
      .catch((err) => notify(err?.response?.data?.msg, 'error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <Container header={<Breadcrumbs page='customerUpdate' />}>
      {customer && <CustomerProfileForm id={id} defaultValues={customer} />}
    </Container>
  )
}
