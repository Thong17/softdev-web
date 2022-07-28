import Breadcrumb from 'components/shared/Breadcrumbs'
import Container from 'components/shared/Container'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'

const Header = ({ stages }) => {
  return <>
    <Breadcrumb stages={stages} title={<StorefrontRoundedIcon />} />
  </>
}

export const Store = () => {
  const stages = [
    {
      title: 'Organize',
      path: '/organize'
    },
    {
      title: 'Store',
    },
  ]

  return (
    <Container header={<Header stages={stages} />}>Detail</Container>
  )
}

export { UpdateStore } from './Update'
