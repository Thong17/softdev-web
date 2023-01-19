import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useState } from 'react'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import useLanguage from 'hooks/useLanguage'

export const Header = ({
  styled,
  navigate,
  handleSearch,
  handleFilter,
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
    const { language } = useLanguage()
    return <>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'name' })}><SortIcon asc={sortObj.name} />{language['BY_NAME']}</MenuItem>
      <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}><SortIcon asc={sortObj.createdAt} />{language['BY_DATE']}</MenuItem>
    </>
  }

  return (
      <DefaultHeader
        styled={styled}
        navigate={navigate}
        handleSearch={handleSearch}
        breadcrumb={<StoreBreadcrumbs page='promotion' />}
        createUrl='/function/promotion/create'
        filterOption={<FilterOption />}
      />
  )
}
