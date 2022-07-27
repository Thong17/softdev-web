import Breadcrumb from 'components/shared/Breadcrumbs'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { FC } from 'react'
import useLanguage from 'hooks/useLanguage'

declare type page = 'admin' | 'role' | 'roleCreate' | 'roleUpdate' | 'user' | 'userCreate' | 'userUpdate'

interface IAdminBreadcrumbs {
  page: page
  title?: string
}

const AdminBreadcrumbs: FC<IAdminBreadcrumbs> = ({ page }) => {
  const { language } = useLanguage()
  const stages = {
    admin: [
      {
        title: language['ADMIN'],
      },
    ],
    role: [
      {
        title: language['ADMIN'],
        path: '/admin',
      },
      {
        title: language['ROLE'],
      },
    ],
    roleCreate: [
      {
        title: language['ADMIN'],
        path: '/admin',
      },
      {
        title: language['ROLE'],
        path: '/admin/role',
      },
      {
        title: language['CREATE'],
      },
    ],
    roleUpdate: [
      {
        title: language['ADMIN'],
        path: '/admin',
      },
      {
        title: language['ROLE'],
        path: '/admin/role',
      },
      {
        title: language['UPDATE'],
      },
    ],
    user: [
      {
        title: language['ADMIN'],
        path: '/admin',
      },
      {
        title: language['USER'],
      },
    ],
    userCreate: [
      {
        title: language['ADMIN'],
        path: '/admin',
      },
      {
        title: language['USER'],
        path: '/admin/user',
      },
      {
        title: language['CREATE'],
      },
    ],
    userUpdate: [
      {
        title: language['ADMIN'],
        path: '/admin',
      },
      {
        title: language['USER'],
        path: '/admin/user',
      },
      {
        title: language['UPDATE'],
      },
    ],
  }
  return <Breadcrumb stages={stages[page]} title={<AdminPanelSettingsIcon />} />
}

export default AdminBreadcrumbs
