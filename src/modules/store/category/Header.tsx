import StoreBreadcrumbs from '../components/Breadcrumbs'
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
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const newCategories = data.map((category) => {
      return {
        _id: category._id,
        name: JSON.stringify(category.name).replace(/"/g, '""'),
        description: category.description,
        status: category.status,
        icon: category.icon?._id
      }
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
        createUrl='/store/category/create'
        filename='categories'
      />
  )
}
