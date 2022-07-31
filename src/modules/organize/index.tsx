import { Layout } from 'components/layouts/Layout'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import Navbar from './components/Navbar'
import StoreBreadcrumbs from './components/Breadcrumbs'

export const Organize = () => {
  const outlet = useOutlet()

  const Header = () => {
    return (
      <>
        <StoreBreadcrumbs page='organize' />
      </>
    )
  }

  return (
    <Layout navbar={<Navbar />}>
      {outlet || <Container header={<Header />}>Store Updated</Container>}
    </Layout>
  )
}

export { Brands, CreateBrand, DetailBrand, UpdateBrand  } from './brand'
export { Categories, CreateCategory, DetailCategory, UpdateCategory  } from './category'
export { Products, CreateProduct, DetailProduct, UpdateProduct, ProductSetup  } from './product'
export { Store, UpdateStore, LayoutForm } from './store'

