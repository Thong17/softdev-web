import React from 'react'
import Container from 'components/shared/Container'
import { useNavigate } from 'react-router-dom'
import MembershipForm from './Form'
import { initState } from './constant'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import useLanguage from 'hooks/useLanguage'

const Header = () => {
  const { language } = useLanguage()
  return (
    <>
      <StoreBreadcrumbs page='membershipCreate' />
      <h2 style={{ margin: 0 }}>{language['CREATE']} {language['MEMBERSHIP']}</h2>
    </>
  )
}

export const CreateMembership = () => {
  return (
    <Container header={<Header />}>
      <MembershipForm defaultValues={initState} />
    </Container>
  )
}