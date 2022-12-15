import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'
import { languages } from 'contexts/language/constant'

export const Header = ({
  data,
  styled,
  navigate,
  handleSearch,
  handleFilter,
  handleImport,
}) => {
  const [categories, setCategories] = useState([])
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
    const newCategories = data.map((category) => {
      const nameLangs = Object.keys(languages)
      let obj = {
        description: category.description,
        status: category.status,
      }
      nameLangs.forEach(lang => {
        obj[`name${lang}`] = category.name[lang] || ''
      })
      return obj
    })
    setCategories(newCategories)
  }, [data])

  return (
      <DefaultHeader
        exportData={categories}
        styled={styled}
        navigate={navigate}
        handleSearch={handleSearch}
        handleImport={handleImport}
        excelHeader={headerColumns}
        breadcrumb={<StoreBreadcrumbs page='category' />}
        createUrl='/organize/category/create'
        filename='categories'
        filterOption={<FilterOption />}
      />
  )
}
