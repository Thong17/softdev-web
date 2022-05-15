import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'

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

interface IAdminBreadcrumbs {
  page: page
  title?: string
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page, title }) => {
  return <Breadcrumb stages={stages[page]} title={title} />
}

export default AdminBreadcrumbs
