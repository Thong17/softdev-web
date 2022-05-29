import AdminBreadcrumbs from '../components/Breadcrumbs'
import Container from 'components/shared/Container'
import { initState } from './constant'
import { RoleForm } from './Form'

export const CreateUser = () => {
  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='userCreate' title='Table' />
      </>
    )
  }

  return (
    <Container header={<Header />}>
      <RoleForm defaultValues={initState} />
    </Container>
  )
}
