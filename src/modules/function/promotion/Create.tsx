import React from 'react'
import PromotionForm from './Form'
import Container from 'components/shared/Container'
import Breadcrumbs from '../components/Breadcrumbs'
import { initState } from './redux/constant'

const Header = () => {
    return <><Breadcrumbs page='promotionCreate' /></>
}

export const CreatePromotion = () => {
  return (
    <Container header={<Header />}>
      <PromotionForm defaultValues={initState} />
    </Container>
  )
}
