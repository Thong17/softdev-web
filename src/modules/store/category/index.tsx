import Container from 'components/shared/Container'
import React from 'react'
import StoreBreadcrumbs from '../components/Breadcrumbs'

const Header = () => {
    return <><StoreBreadcrumbs page='category' title='Category' /></>
}

export const Category = () => {
  return (
    <Container header={<Header />}>category</Container>
  )
}
