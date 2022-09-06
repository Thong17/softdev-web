import { Layout } from 'components/layouts/Layout'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import Navbar from './components/Navbar'
import SaleBreadcrumbs from './components/Breadcrumbs'

export const Sale = () => {
  const outlet = useOutlet()

  const Header = () => {
    return (
      <>
        <SaleBreadcrumbs page='sale' />
      </>
    )
  }

  return (
    <Layout navbar={<Navbar />}>
      {outlet || <Container header={<Header />}>Store Updated</Container>}
    </Layout>
  )
}

export { Reservation } from './reservation'
export { Payment } from './payment'
export { Cashing } from './cashing'
export { Stocks, Stock } from './stock'
export { Promotions, CreatePromotion, UpdatePromotion, DetailPromotion } from './promotion'