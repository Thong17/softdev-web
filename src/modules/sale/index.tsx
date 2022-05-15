import { Layout } from 'components/layouts/Layout'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import SaleNavbar from './components/SaleNavbar'
import SaleBreadcrumbs from './components/Breadcrumbs'

export const Sale = () => {
  const outlet = useOutlet()

  const Header = () => {
    return (
      <>
        <SaleBreadcrumbs page='sale' title='Dashboard' />
      </>
    )
  }

  return (
    <Layout navbar={<SaleNavbar />}>
      {outlet || <Container header={<Header />}>Store Updated</Container>}
    </Layout>
  )
}