import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Container from 'components/shared/Container'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import Breadcrumbs from '../components/Breadcrumbs'
import { CustomerProfileForm, initCustomer, toCustomerForm } from './Form'
import { getPending, IPendingCustomer } from 'shared/offline/db'

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
      .then((response) => setCustomer(response?.data?.data))
      .catch((err) => notify(err?.response?.data?.msg || (!err?.response ? 'You are offline. Saved customers open once you are back online' : undefined), 'error'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const defaultValues = useMemo(() => customer && toCustomerForm(customer), [customer])

  return (
    <Container header={<Breadcrumbs page='customerUpdate' />}>
      {customer && <CustomerProfileForm id={id} defaultValues={defaultValues} picture={customer.picture} />}
    </Container>
  )
}

// A customer added offline and not synced yet, e.g. to fix a name conflict
export const OfflineCustomer = () => {
  const { clientId } = useParams()
  const { notify } = useNotify()
  const navigate = useNavigate()
  const [record, setRecord] = useState<IPendingCustomer | null>(null)

  useEffect(() => {
    if (!clientId) return
    getPending(clientId).then((found) => {
      if (found) return setRecord(found)
      notify('This customer has already synced or was removed', 'info')
      navigate('/function/customer', { replace: true })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const defaultValues = useMemo(() => record && toCustomerForm(record.body), [record])

  return (
    <Container header={<Breadcrumbs page='customerCreate' />}>
      {record && <CustomerProfileForm defaultValues={defaultValues} offlineRecord={record} />}
    </Container>
  )
}
