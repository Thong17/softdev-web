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
  const [roles, setRoles] = useState([])

  useEffect(() => {
    const newRoles = data.map((role) => {
      return {
        _id: role._id,
        name: JSON.stringify(role.name).replace(/"/g, '""'),
        description: role.description,
        privilege: JSON.stringify(role.privilege).replace(/"/g, '""'),
      }
    })
    setRoles(newRoles)
  }, [data])

  return (
    <DefaultHeader
      exportData={roles}
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      excelHeader={headerColumns}
      breadcrumb={<AdminBreadcrumbs page='role' />}
      createUrl='/admin/role/create'
      filename='roles'
    />
  )
}
