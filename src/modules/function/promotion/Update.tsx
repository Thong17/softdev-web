import React, { useEffect } from 'react'
import PromotionForm from './Form'
import Container from 'components/shared/Container'
import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useParams } from 'react-router-dom'
import { getPromotion, selectPromotion } from './redux'
import { inputDateTimeFormat } from 'utils'

const Header = () => {
    return <><StoreBreadcrumbs page='promotionUpdate' /></>
}

export const UpdatePromotion = () => {
  const dispatch = useAppDispatch()
  const { data: defaultValues, status } = useAppSelector(selectPromotion)
  const { id } = useParams()
  
  useEffect(() => {
    if (id) {
      dispatch(getPromotion({ id, fields: ['value', 'type', 'isFixed', 'description', 'startAt', 'expireAt', 'products'] }))
    }
  }, [dispatch, id])
  
  return (
    <Container header={<Header />}>
      {
        status === 'SUCCESS' && <PromotionForm id={id} defaultValues={{ ...defaultValues, startAt: inputDateTimeFormat(defaultValues.startAt), expireAt: inputDateTimeFormat(defaultValues.expireAt) }} />
      }
    </Container>
  )
}
