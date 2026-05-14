import React from 'react'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import useLanguage from 'hooks/useLanguage'

const Header = () => {
  const { language } = useLanguage()
  return (
    <>
      <StoreBreadcrumbs page='membershipDetail' />
      <h2 style={{ margin: 0 }}>{language['DETAIL']} {language['MEMBERSHIP']}</h2>
    </>
  )
}

export const DetailMembership = () => {
  return (
    <Container header={<Header />}>
      <div>Membership detail view - To be implemented</div>
    </Container>
  )
}