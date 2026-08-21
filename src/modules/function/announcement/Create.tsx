import React from 'react'
import AnnouncementForm from './Form'
import Container from 'components/shared/Container'
import Breadcrumbs from '../components/Breadcrumbs'
import { initState } from './redux/constant'

const Header = () => {
    return <><Breadcrumbs page='bannerCreate' /></>
}

export const CreateAnnouncement = () => {
  return (
    <Container header={<Header />}>
      <AnnouncementForm defaultValues={initState} />
    </Container>
  )
}
