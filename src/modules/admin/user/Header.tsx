import AdminBreadcrumbs from '../components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'

export const Header = ({
  data,
  styled,
  navigate,
  handleSearch,
  handleImport,
}) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const newUsers = data.map((user) => {
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role._id,
        config: user.config,
        profile: user.profile
      }
    })
    setUsers(newUsers)
  }, [data])

  return (
    <DefaultHeader
      exportData={users}
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      excelHeader={headerColumns}
      breadcrumb={<AdminBreadcrumbs page='user' />}
      createUrl='/admin/user/create'
      filename='users'
    />
  )
}
