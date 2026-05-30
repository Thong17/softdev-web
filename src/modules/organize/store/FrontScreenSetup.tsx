import React from 'react'
import Container from 'components/shared/Container'
import { useParams } from 'react-router-dom'
import Breadcrumb from 'components/shared/Breadcrumbs'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import useLanguage from 'hooks/useLanguage'
import FrontScreen from 'modules/front-screen'

const Header = ({ stages }) => {
  return (
    <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
  )
}

export const FrontScreenSetup = () => {
  const { id } = useParams()
  const { language } = useLanguage()

  const stages = [
    {
      title: language['ORGANIZE'],
      path: '/organize',
    },
    {
      title: language['STORE'],
      path: '/organize/store',
    },
    {
      title: language['INFO'],
      path: `/organize/store/update/${id}`,
    },
    {
      title: language['PAYMENT'],
      path: `/organize/store/${id}/payment`,
    },
    {
      title: language['FRONT_SCREEN'],
    },
  ]

  return (
    <Container header={<Header stages={stages} />}>
      <div
        className='payment-container'
        style={{ height: '100%', width: '100%', position: 'absolute', backgroundColor: 'rebeccapurple' }}
      >
        <FrontScreen />
      </div>
    </Container>
  )
}
