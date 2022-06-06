import React from 'react'
import ProductForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { initState } from './redux/constant'

const Header = () => {
    return <><StoreBreadcrumbs page='productCreate' /></>
}

export const CreateProduct = () => {
  return (
    <Container header={<Header />}>
      <ProductForm defaultValues={initState} />
    </Container>
  )
}
