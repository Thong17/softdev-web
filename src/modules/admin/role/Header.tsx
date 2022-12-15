import AdminBreadcrumbs from '../components/Breadcrumbs'
import { useState } from 'react'
import { headerColumns } from './constant'
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
    name: false,
    createdAt: false,
    isDefault: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    return <>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}><SortIcon asc={sortObj.name} /> By Name</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date Created</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'isDefault' })}><SortIcon asc={sortObj.isDefault} /> By Type</MenuItem>
    </>
  }

  return (
    <DefaultHeader
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      handleImport={handleImport}
      excelHeader={headerColumns}
      breadcrumb={<AdminBreadcrumbs page='role' />}
      createUrl='/admin/role/create'
      filename='roles'
      filterOption={<FilterOption />}
    />
  )
}
