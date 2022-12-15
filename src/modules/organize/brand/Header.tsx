import StoreBreadcrumbs from '../components/Breadcrumbs'
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
    name: false,
    createdAt: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    return <>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}><SortIcon asc={sortObj.name} /> By Name</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} /> By Date</MenuItem>
    </>
  }

  return (
      <DefaultHeader
        optionAction={true}
        exportUrl='/organize/brand/excel/export'
        styled={styled}
        navigate={navigate}
        handleSearch={handleSearch}
        handleImport={handleImport}
        breadcrumb={<StoreBreadcrumbs page='brand' />}
        createUrl='/organize/brand/create'
        filterOption={<FilterOption />}
      />
  )
}
