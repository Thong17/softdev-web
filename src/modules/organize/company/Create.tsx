import React from 'react'
import CompanyForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { initState } from './redux/constant'

const Header = () => {
    return <><StoreBreadcrumbs page='companyCreate' /></>
}

export const CreateCompany = () => {
  return (
    <Container header={<Header />}>
      <CompanyForm defaultValues={initState} />
    </Container>
  )
}
