import { Layout } from 'components/layouts/Layout'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import Navbar from './components/Navbar'
import StoreBreadcrumbs from './components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { DetailSection } from 'components/shared/container/DetailSection'
import useTheme from 'hooks/useTheme'
import { CustomPieChart } from 'components/shared/charts/PieChart'
import { useEffect, useState } from 'react'
import { getOrganizeDashboard, selectOrganizeDashboard } from 'shared/redux'
import useLanguage from 'hooks/useLanguage'
import { useLocation } from 'react-router-dom'
import { CardContainer } from 'components/shared/container/CardContainer'
import useWeb from 'hooks/useWeb'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import TableBarRoundedIcon from '@mui/icons-material/TableBarRounded'
import InterestsRoundedIcon from '@mui/icons-material/InterestsRounded'
import EscalatorRoundedIcon from '@mui/icons-material/EscalatorRounded'
import { generateColor } from 'utils/index'

const Header = () => {
  return (
    <>
      <StoreBreadcrumbs page='organize' />
    </>
  )
}

export const Organize = () => {
  const outlet = useOutlet()
  const { width } = useWeb()
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const [totalCategory, setTotalCategory] = useState(0)
  const [totalBrand, setTotalBrand] = useState(0)
  const [totalProduct, setTotalProduct] = useState(0)
  const [totalFloor, setTotalFloor] = useState(0)
  const [totalStructure, setTotalStructure] = useState(0)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [floors, setFloors] = useState([])
  const [products, setProducts] = useState([])

  const dispatch = useAppDispatch()
  const location = useLocation()
  const { data: dashboard } = useAppSelector(selectOrganizeDashboard)

  useEffect(() => {
    const mappedCategory = dashboard?.categories?.map((item) => {
      return {
        name: item.name?.[lang],
        value: item.value,
        title: item.title,
        detail: `Category`,
        fill: generateColor()
      }
    })
    setCategories(mappedCategory)

    const mappedBrand = dashboard?.brands?.map((item) => {
      return {
        name: item.name?.[lang],
        value: item.value,
        title: item.title,
        detail: `Brand`,
        fill: generateColor()
      }
    })
    setBrands(mappedBrand)

    const mappedFloor = dashboard?.floors?.map((item) => {
      return {
        name: item.name?.[lang],
        value: item.value,
        title: item.title,
        detail: `Floor`,
        fill: generateColor()
      }
    })
    setFloors(mappedFloor)

    const mappedProduct = dashboard?.products?.map((item) => {
      console.log(item);
      
      return {
        name: item.name?.[lang],
        value: item.value,
        title: item.title,
        detail: `Product`,
        fill: generateColor()
      }
    })
    setProducts(mappedProduct)

    setTotalCategory(dashboard?.totalCategory)
    setTotalBrand(dashboard?.totalBrand)
    setTotalProduct(dashboard?.totalProduct)
    setTotalFloor(dashboard?.totalFloor)
    setTotalStructure(dashboard?.totalStructure)
  }, [dashboard, lang, theme])

  useEffect(() => {
    if (location.pathname !== '/organize') return
    dispatch(getOrganizeDashboard())
  }, [dispatch, location.pathname])

  return (
    <Layout navbar={<Navbar />}>
      {outlet || (
        <Container header={<Header />}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridGap: 20,
              gridTemplateAreas:
                width < 1024
                  ? ` 
                'header header' 
                'category category'
                'brand brand'
                'product product'
                'floor floor'
              `
                  : ` 
                'header header' 
                'category brand'
                'product floor'
              `,
            }}
          >
            <div
              style={{
                gridArea: 'header',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                overflowX: 'auto',
                padding: 20,
              }}
            >
              <DetailSection
                title='Total Category'
                data={totalCategory}
                icon={<CategoryRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Total Brand'
                data={totalBrand}
                icon={<InterestsRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Total Product'
                data={totalProduct}
                icon={<Inventory2RoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Total Floor'
                data={totalFloor}
                icon={<EscalatorRoundedIcon style={{ fontSize: 40 }} />}
              />
              <DetailSection
                title='Total Structure'
                data={totalStructure}
                icon={<TableBarRoundedIcon style={{ fontSize: 40 }} />}
              />
            </div>
            <CardContainer
              title={<>Category</>}
              style={{ gridArea: 'category' }}
            >
              <CustomPieChart
                data={categories}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
            <CardContainer title={<>Brand</>} style={{ gridArea: 'brand' }}>
              <CustomPieChart
                data={brands}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
            <CardContainer title={<>Product</>} style={{ gridArea: 'product' }}>
              <CustomPieChart
                data={products}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
            <CardContainer
              title={<>Floor</>}
              style={{ gridArea: 'floor' }}
            >
              <CustomPieChart
                data={floors}
                fill={'#7B7D7D'}
                color={theme.text.secondary}
              />
            </CardContainer>
          </div>
        </Container>
      )}
    </Layout>
  )
}

export { Brands, CreateBrand, DetailBrand, UpdateBrand } from './brand'
export {
  Categories,
  CreateCategory,
  DetailCategory,
  UpdateCategory,
} from './category'
export {
  Products,
  CreateProduct,
  DetailProduct,
  UpdateProduct,
  ProductSetup,
} from './product'
export { Store, UpdateStore, LayoutForm } from './store'
