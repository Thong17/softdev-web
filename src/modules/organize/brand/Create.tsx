import React from 'react'
import BrandForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { initState } from './redux/constant'

const Header = () => {
    return <><StoreBreadcrumbs page='brandCreate' /></>
}

export const CreateBrand = () => {
  return (
    <Container header={<Header />}>
      <BrandForm defaultValues={initState} />
    </Container>
  )
}
