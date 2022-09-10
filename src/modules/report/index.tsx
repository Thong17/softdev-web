import { Layout } from 'components/layouts/Layout'
import ReportNavbar from './components/ReportNavbar'
import { useOutlet } from 'react-router'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export const Report = () => {
  const outlet = useOutlet()
  const location = useLocation()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (location.pathname === '/report') navigate('/report/sale')
  }, [location.pathname, navigate])
  
  return (
    <Layout navbar={<ReportNavbar />}>
      {outlet}
    </Layout>
  )
}

export { SaleReport } from './SaleReport'