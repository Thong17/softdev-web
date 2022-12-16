import AdminBreadcrumbs from '../components/Breadcrumbs'
import { useState } from 'react'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'

export const Header = ({
  styled,
  navigate,
  handleSearch,
  handleFilter,
  handleImport,
}) => {
  const [sortObj, setSortObj] = useState({
    username: false,
    createdAt: false,
    email: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    return <>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'username' })}><SortIcon asc={sortObj.username} /> By Username</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date Created</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'email' })}><SortIcon asc={sortObj.email} /> By Email</MenuItem>
    </>
  }

  return (
    <DefaultHeader
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      breadcrumb={<AdminBreadcrumbs page='user' />}
      createUrl='/admin/user/create'
      filterOption={<FilterOption />}
    />
  )
}
