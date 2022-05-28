import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { RoleForm } from './Form'

export const CreateRole = () => {
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='roleCreate' title='Table' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <RoleForm />
    </Container>
  )
}
