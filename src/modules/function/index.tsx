import { Layout } from 'components/layouts/Layout'
import Navbar from './components/Navbar'
import { useOutlet } from 'react-router'
import Container from 'components/shared/Container'
import AdminBreadcrumbs from './components/Breadcrumbs'
import { useAppDispatch } from 'app/hooks'
import { useEffect } from 'react'
import { getQueueDashboard } from 'shared/redux'
import { useLocation } from 'react-router-dom'
import useWeb from 'hooks/useWeb'

const Header = () => {
  return (
    <>
      <AdminBreadcrumbs page='function' title='Dashboard' />
    </>
  )
}

export const Function = () => {
  const outlet = useOutlet()
  const { width } = useWeb()
  const dispatch = useAppDispatch()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/admin') return
    dispatch(getQueueDashboard())
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
              gridTemplateAreas: width < 1024 ? ` 
                'header header' 
                'queue queue'
              ` : ` 
                'header header' 
                'queue queue'
              `,
            }}
          >

          </div>
        </Container>
      )}
    </Layout>
  )
}

export {
  Promotions,
  CreatePromotion,
  UpdatePromotion,
  DetailPromotion,
} from './promotion'