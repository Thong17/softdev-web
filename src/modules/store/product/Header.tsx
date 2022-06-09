import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { headerColumns } from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import { HeaderButton } from 'components/shared/table/HeaderButton'

export const Header = ({
  changeLayout,
  isGrid,
  data,
  styled,
  navigate,
  handleSearch,
  handleImport,
}) => {
  const [products, setProducts] = useState([])
  const [grid, setGrid] = useState(isGrid)

  useEffect(() => {
    setGrid(isGrid)
  }, [isGrid])
  
  useEffect(() => {
    const newProducts = data.map((product) => {
      return {
        _id: product._id,
        name: JSON.stringify(product.name).replace(/"/g, '""'),
        price: product.price,
        currency: product.currency,
        code: product.code,
        isStock: product.isStock,
        brand: product.brand?._id,
        category: product.category?._id,
        description: product.description,
        status: product.status,
        profile: product.profile?.filename,
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
      >
        <HeaderButton style={{ marginLeft: 10 }} onClick={() => { return changeLayout() }}>
          { !grid ? <GridViewRoundedIcon /> : <ViewListRoundedIcon /> }
        </HeaderButton>
      </DefaultHeader>
  )
}
