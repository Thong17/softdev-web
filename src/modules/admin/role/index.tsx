import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export const Role = () => {
  const navigate = useNavigate()
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='role' title='Table' />
        <Button onClick={() => navigate('/admin/role/create')}>Create</Button>
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <h1>Role</h1>
    </Container>
  )
}
