import Container from 'components/shared/Container'
import React from 'react'
import StoreBreadcrumbs from '../components/Breadcrumbs'

const Header = () => {
    return <><StoreBreadcrumbs page='category' /></>
}

export const Category = () => {
  return (
    <Container header={<Header />}>category</Container>
  )
}
