import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'

export const Header = ({
  data,
  styled,
  navigate,
  handleSearch,
  handleFilter,
  handleImport,
}) => {
  const [brands, setBrands] = useState([])
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

  useEffect(() => {
    const newBrands = data.map((brand) => {
      return {
        _id: brand._id,
        name: JSON.stringify(brand.name)?.replace(/"/g, '""'),
        description: brand.description,
        status: brand.status,
        icon: JSON.stringify(brand.icon)?.replace(/"/g, '""')
      }
    })
    setBrands(newBrands)
  }, [data])

  return (
      <DefaultHeader
        exportData={brands}
        styled={styled}
        navigate={navigate}
        handleSearch={handleSearch}
        handleImport={handleImport}
        excelHeader={headerColumns}
        breadcrumb={<StoreBreadcrumbs page='brand' />}
        createUrl='/store/brand/create'
        filename='brands'
        filterOption={<FilterOption />}
      />
  )
}
