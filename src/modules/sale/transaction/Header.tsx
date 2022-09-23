import SaleBreadcrumbs from '../components/Breadcrumbs'
import { useState } from 'react'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import useLanguage from 'hooks/useLanguage'
import { FilterButton } from 'components/shared/table/FilterButton'
import { SearchField } from 'components/shared/table/SearchField'

export const Header = ({ handleSearch, handleFilter }) => {
  const [sortObj, setSortObj] = useState({
    description: false,
    createdAt: false,
  })

  const handleChangeFilter = ({ filter }) => {
    setSortObj({ ...sortObj, [filter]: !sortObj[filter] })
    return handleFilter({ filter, asc: sortObj[filter] })
  }

  const FilterOption = () => {
    const { language } = useLanguage()
    return (
      <>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'description' })}>
          <SortIcon asc={sortObj.description} />
          {language['BY_DESCRIPTION']}
        </MenuItem>
        <MenuItem onClick={() => handleChangeFilter({ filter: 'createdAt' })}>
          <SortIcon asc={sortObj.createdAt} />
          {language['BY_DATE']}
        </MenuItem>
      </>
    )
  }

  return (
    <>
      <SaleBreadcrumbs page='transaction' />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchField onChange={handleSearch} />
        <FilterButton style={{ marginLeft: 10 }}>
          <FilterOption />
        </FilterButton>
      </div>
    </>
  )
}
