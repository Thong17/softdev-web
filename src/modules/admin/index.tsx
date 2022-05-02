import { Layout } from 'components/layouts/Layout'
import AdminNavbar from './components/AdminNavbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'

export const Admin = () => {
  const outlet = useOutlet()

  return (
    <Layout navbar={<AdminNavbar />}>
      {outlet || <Container>Admin</Container>}
    </Layout>
  )
}

export { User } from './user'
export { Role } from './role'
