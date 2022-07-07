import { Layout } from 'components/layouts/Layout'
import Navbar from './components/Navbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'

export const Admin = () => {
  const outlet = useOutlet()

  const Header = () => {
    return (
      <>
        <AdminBreadcrumbs page='admin' title='Dashboard' />
      </>
    )
  }

  return (
    <Layout navbar={<Navbar />}>
      {outlet || <Container header={<Header />}>Admin Updated</Container>}
    </Layout>
  )
}

export { Users, CreateUser, UpdateUser, DetailUser } from './user'
export { Roles, CreateRole, UpdateRole, DetailRole } from './role'

