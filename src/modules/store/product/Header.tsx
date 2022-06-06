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
  const [products, setProducts] = useState([])

  useEffect(() => {
    const newProducts = data.map((product) => {
      return {
        _id: product._id,
        name: JSON.stringify(product.name).replace(/"/g, '""'),
        description: product.description,
        status: product.status,
        icon: product.icon?._id,
      }
    })
    setProducts(newProducts)
  }, [data])

  return (
      <DefaultHeader
        importData={products}
        styled={styled}
        navigate={navigate}
        handleSearch={handleSearch}
        handleImport={handleImport}
        excelHeader={headerColumns}
        breadcrumb={<StoreBreadcrumbs page='product' />}
        createUrl='/store/product/create'
        filename='products'
      />
  )
}
