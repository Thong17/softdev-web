import Breadcrumb from 'components/shared/Breadcrumbs'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { FC } from 'react'
import { stages } from './constant'

declare type page = 'admin' | 'role' | 'roleCreate' | 'roleUpdate' | 'user' | 'userCreate' | 'userUpdate'

interface IAdminBreadcrumbs {
  page: page
  title?: string
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page, title }) => {
  return <Breadcrumb stages={stages[page]} title={<AdminPanelSettingsIcon />} />
}

export default AdminBreadcrumbs
