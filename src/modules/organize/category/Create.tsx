import React from 'react'
import CategoryForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { initState } from './redux/constant'

const Header = () => {
    return <><StoreBreadcrumbs page='categoryCreate' /></>
}

export const CreateCategory = () => {
  return (
    <Container header={<Header />}>
      <CategoryForm defaultValues={initState} />
    </Container>
  )
}
