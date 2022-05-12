import Breadcrumb from 'components/shared/Breadcrumbs'

const stages = {
  admin: [
    {
      title: 'Admin',
    },
  ],
  role: [
    {
      title: 'Admin',
      path: '/admin',
    },
    {
      title: 'Role',
    },
  ],
  user: [
    {
      title: 'Admin',
      path: '/admin',
    },
    {
      title: 'User',
    },
  ],
}
declare type page = 'admin' | 'role' | 'user'

const AdminBreadcrumbs = ({ page, title }: { page: page, title?: string }) => {
  return <Breadcrumb stages={stages[page]} title={title} />
}

export default AdminBreadcrumbs
