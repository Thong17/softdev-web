import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import useLanguage from 'hooks/useLanguage'

export const Header = ({
  data,
  styled,
  navigate,
  handleSearch,
  handleFilter,
  handleImport,
}) => {
  const [promotions, setPromotions] = useState([])
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

  useEffect(() => {
    const newPromotions = data.map((promotion) => {
      return {
        _id: promotion._id,
        name: JSON.stringify(promotion.name)?.replace(/"/g, '""'),
        description: promotion.description,
        status: promotion.status,
        icon: JSON.stringify(promotion.icon)?.replace(/"/g, '""')
      }
    })
    setPromotions(newPromotions)
  }, [data])

  return (
      <DefaultHeader
        exportData={promotions}
        styled={styled}
        navigate={navigate}
        handleSearch={handleSearch}
        handleImport={handleImport}
        excelHeader={headerColumns}
        breadcrumb={<StoreBreadcrumbs page='promotion' />}
        createUrl='/sale/promotion/create'
        filename='promotions'
        filterOption={<FilterOption />}
      />
  )
}
