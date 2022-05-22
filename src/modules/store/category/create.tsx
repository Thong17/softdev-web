import React from 'react'
import CategoryForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'

const Header = () => {
    return <><StoreBreadcrumbs page='categoryCreate' /></>
}

export const CreateCategory = () => {
  return (
    <Container header={<Header />}>
      <CategoryForm />
    </Container>
  )
}
