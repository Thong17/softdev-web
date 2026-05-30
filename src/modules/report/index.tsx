import { Layout } from 'components/layouts/Layout'
import ReportNavbar from './components/ReportNavbar'
import { useOutlet } from 'react-router'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuth from 'hooks/useAuth'

export const Report = () => {
  const outlet = useOutlet()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  useEffect(() => {
    if (location.pathname === '/report') {
      user?.privilege?.report?.sale ? navigate('/report/sale') : navigate('/report/payment')
    }
  }, [location.pathname, navigate, user?.privilege?.report?.sale])

  return (
    <Layout navbar={<ReportNavbar />}>
      {outlet}
    </Layout>
  )
}

export { SaleReport } from './SaleReport'