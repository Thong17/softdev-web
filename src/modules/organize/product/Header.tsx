import StoreBreadcrumbs from '../components/Breadcrumbs'
import { useEffect, useState } from 'react'
import {
  productHeaderColumns,
  detailHeaderColumns,
  imageHeaderColumns,
  colorHeaderColumns,
  optionHeaderColumns,
  propertyHeaderColumns,
} from './constant'
import { DefaultHeader } from 'components/shared/table/DefaultHeader'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'
import { HeaderButton } from 'components/shared/table/HeaderButton'
import { CSVLink } from 'react-csv'
import { NestedMenuList } from 'components/shared/NestedMenuList'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import useLanguage from 'hooks/useLanguage'
import { MenuItem } from '@mui/material'
import { SortIcon } from 'components/shared/icons/SortIcon'

export const Header = ({
  changeLayout,
  isGrid,
  data,
  styled,
  navigate,
  handleSearch,
  handleFilter,
  handleImport,
}) => {
  const [products, setProducts] = useState([])
  const [images, setImages] = useState([])
  const [colors, setColors] = useState([])
  const [properties, setProperties] = useState([])
  const [options, setOptions] = useState([])
  const [grid, setGrid] = useState(isGrid)
  const [sortObj, setSortObj] = useState({
    name: false,
    createdAt: false,
    priceValue: false,
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
      <MenuItem onClick={() => handleChangeFilter({ filter: 'priceValue' })}><SortIcon asc={sortObj.priceValue} />{language['BY_PRICE']}</MenuItem>
    </>
  }
  
  useEffect(() => {
    setGrid(isGrid)
  }, [isGrid])

  useEffect(() => {
    let mapImages = []
    let mapOptions = []
    let mapProperties = []
    let mapColors = []
    const mapProducts = data.map((product) => {
      let images = product.images
      
      mapOptions = product.options?.map((option) => {
        if (option.profile) {
          images = [...images, option.profile]
        }
        return {
          _id: option._id,
          name: JSON.stringify(option.name)?.replace(/"/g, '""'),
          price: option.price,
          currency: option.currency,
          description: option.description,
          profile: option.profile,
          property: option.property,
          product: option.product,
        }
      })
      mapColors = product.colors?.map((color) => {
        if (color.images) {
          images = [...images, ...color.images]
        }
        return {
          _id: color._id,
          name: JSON.stringify(color.name)?.replace(/"/g, '""'),
          price: color.price,
          currency: color.currency,
          images: color.images,
          profile: color.profile,
          product: color.product,
        }
      })
      mapProperties = product.properties?.map((property) => {
        return {
          _id: property._id,
          name: JSON.stringify(property.name)?.replace(/"/g, '""'),
          description: property.description,
          product: property.product,
        }
      })
      mapImages = images?.map((image) => {
        return {
          _id: image._id,
          filename: image.filename,
          isActive: image.isActive
        }
      })
      return {
        _id: product._id,
        name: JSON.stringify(product.name)?.replace(/"/g, '""'),
        price: product.price,
        currency: product.currency,
        code: product.code,
        isStock: product.isStock,
        brand: product.brand?._id,
        category: product.category?._id,
        description: product.description,
        status: product.status,
        profile: product.profile?._id,
        images: JSON.stringify(product.images)?.replace(/"/g, '""'),
        options: JSON.stringify(product.options)?.replace(/"/g, '""'),
        properties: JSON.stringify(product.properties)?.replace(/"/g, '""'),
        colors: JSON.stringify(product.colors)?.replace(/"/g, '""'),
        detail: JSON.stringify(product.detail)?.replace(/"/g, '""')
      }
    })
    setImages(mapImages)
    setColors(mapColors)
    setProperties(mapProperties)
    setOptions(mapOptions)
    setProducts(mapProducts)
  }, [data])

  return (
    <DefaultHeader
      filterOption={<FilterOption />}
      exportComponent={
        <NestedMenuList label='Export Data' icon={<ArrowDropDownRoundedIcon />}>
          <CSVLink
            headers={productHeaderColumns}
            data={products}
            filename={`product_${new Date().toDateString()}.csv`}
            style={{
              color: styled.text.secondary,
              textDecoration: 'none',
            }}
          >
            Product
          </CSVLink>
          <CSVLink
            headers={detailHeaderColumns}
            data={[]}
            filename={`product_detail_${new Date().toDateString()}.csv`}
            style={{
              color: styled.text.secondary,
              textDecoration: 'none',
            }}
          >
            Detail
          </CSVLink>
          <CSVLink
            headers={imageHeaderColumns}
            data={images}
            filename={`product_image_${new Date().toDateString()}.csv`}
            style={{
              color: styled.text.secondary,
              textDecoration: 'none',
            }}
          >
            Image
          </CSVLink>
          <CSVLink
            headers={colorHeaderColumns}
            data={colors}
            filename={`product_color_${new Date().toDateString()}.csv`}
            style={{
              color: styled.text.secondary,
              textDecoration: 'none',
            }}
          >
            Color
          </CSVLink>
          <CSVLink
            headers={propertyHeaderColumns}
            data={properties}
            filename={`product_property_${new Date().toDateString()}.csv`}
            style={{
              color: styled.text.secondary,
              textDecoration: 'none',
            }}
          >
            Property
          </CSVLink>
          <CSVLink
            headers={optionHeaderColumns}
            data={options}
            filename={`product_option_${new Date().toDateString()}.csv`}
            style={{
              color: styled.text.secondary,
              textDecoration: 'none',
            }}
          >
            Option
          </CSVLink>
        </NestedMenuList>
      }
      importComponent={
        <NestedMenuList label='Import Data' icon={<ArrowDropDownRoundedIcon />}>
          <label htmlFor='product' style={{ cursor: 'pointer' }}>
            Product
            <input
              name='product'
              id='product'
              type='file'
              onChange={(e) => handleImport(e)}
              style={{ display: 'none' }}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            />
          </label>
          <label htmlFor='detail' style={{ cursor: 'pointer' }}>
            Detail
            <input
              name='detail'
              id='detail'
              type='file'
              onChange={(e) => handleImport(e)}
              style={{ display: 'none' }}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            />
          </label>
          <label htmlFor='image' style={{ cursor: 'pointer' }}>
            Image
            <input
              name='image'
              id='image'
              type='file'
              onChange={(e) => handleImport(e)}
              style={{ display: 'none' }}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            />
          </label>
          <label htmlFor='color' style={{ cursor: 'pointer' }}>
            Color
            <input
              name='color'
              id='color'
              type='file'
              onChange={(e) => handleImport(e)}
              style={{ display: 'none' }}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            />
          </label>
          <label htmlFor='property' style={{ cursor: 'pointer' }}>
            Property
            <input
              name='property'
              id='property'
              type='file'
              onChange={(e) => handleImport(e)}
              style={{ display: 'none' }}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            />
          </label>
          <label htmlFor='option' style={{ cursor: 'pointer' }}>
            Option
            <input
              name='option'
              id='option'
              type='file'
              onChange={(e) => handleImport(e)}
              style={{ display: 'none' }}
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
            />
          </label>
        </NestedMenuList>
      }
      styled={styled}
      navigate={navigate}
      handleSearch={handleSearch}
      breadcrumb={<StoreBreadcrumbs page='product' />}
      createUrl='/organize/product/create'
      filename='products'
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
