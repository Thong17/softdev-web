import { useEffect, useState } from 'react'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import { HeaderButton } from 'components/shared/table/HeaderButton'
import SaleBreadcrumbs from '../components/Breadcrumbs'
import useLanguage from 'hooks/useLanguage'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'

export const Header = ({
  changeLayout,
  isGrid,
  styled,
  navigate,
  handleSearch,
  handleFilter,
}) => {
  const [grid, setGrid] = useState(isGrid)
  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
    price: false,
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
      <MenuItem onClick={() => handleChangeFilter({ filter: 'price' })}><SortIcon asc={sortObj.price} />{language['BY_PRICE']}</MenuItem>
    </>
  }

  useEffect(() => {
    setGrid(isGrid)
  }, [isGrid])

  return (
    <DefaultHeader
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      breadcrumb={<SaleBreadcrumbs page='stock' />}
      filterOption={<FilterOption />}
    >
      <HeaderButton
        style={{ marginLeft: 10 }}
        onClick={() => {
          return changeLayout()
        }}
      >
        {!grid ? <GridViewRoundedIcon /> : <ViewListRoundedIcon />}
      </HeaderButton>
    </DefaultHeader>
  )
}
