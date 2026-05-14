import React, { useEffect } from 'react'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import MembershipForm from './Form'
import { getMembership, selectMembership } from './redux'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { inputDateTimeFormat } from 'utils'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import useLanguage from 'hooks/useLanguage'

const Header = () => {
  const { language } = useLanguage()
  return (
    <>
      <StoreBreadcrumbs page='membershipUpdate' />
      <h2 style={{ margin: 0 }}>{language['UPDATE']} {language['MEMBERSHIP']}</h2>
    </>
  )
}

export const UpdateMembership = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectMembership)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(getMembership({ 
        id, 
        fields: ['name', 'description', 'discount', 'target', 'duration', 'note', 'startAt', 'expireAt'] 
      }))
    }
  }, [id, dispatch])

  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && defaultValues && (
          <MembershipForm 
            id={id} 
            defaultValues={defaultValues as any}
          />
        )
      }
    </Container>
  )
}