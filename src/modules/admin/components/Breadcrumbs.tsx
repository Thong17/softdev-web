import Breadcrumb from 'components/shared/Breadcrumbs'
import { FC } from 'react'
import { stages } from './constant'

declare type page = 'admin' | 'role' | 'roleCreate' | 'roleUpdate' | 'user'

interface IAdminBreadcrumbs {
  page: page
  title?: string
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page, title }) => {
  return <Breadcrumb stages={stages[page]} title={title} />
}

export default AdminBreadcrumbs
