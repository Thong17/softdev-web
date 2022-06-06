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
  const [brands, setBrands] = useState([])

  useEffect(() => {
    const newBrands = data.map((brand) => {
      return {
        _id: brand._id,
        name: JSON.stringify(brand.name).replace(/"/g, '""'),
        description: brand.description,
        status: brand.status,
        icon: brand.icon?._id,
      }
    })
    setBrands(newBrands)
  }, [data])

  return (
      <DefaultHeader
        importData={brands}
        styled={styled}
        navigate={navigate}
        handleSearch={handleSearch}
        handleImport={handleImport}
        excelHeader={headerColumns}
        breadcrumb={<StoreBreadcrumbs page='brand' />}
        createUrl='/store/brand/create'
        filename='brands'
      />
  )
}
