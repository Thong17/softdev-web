import React, { useEffect } from 'react'
import CompanyForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getCompany, selectCompany } from './redux'

const Header = () => {
    return <><StoreBreadcrumbs page='companyUpdate' /></>
}

export const UpdateCompany = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectCompany)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(getCompany({ id, fields: ['name', 'legalName', 'logo', 'status', 'contact', 'email', 'address'] }))
    }
  }, [dispatch, id])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <CompanyForm id={id} defaultValues={defaultValues} />
      }
    </Container>
  )
}
