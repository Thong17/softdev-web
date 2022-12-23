import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import { NavLink } from 'react-router-dom'

const ReportNavbar = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  return (
    <>
      {user?.privilege?.report?.sale && <NavLink to='/report/sale'>{language['SALE']}</NavLink>}
      {user?.privilege?.report?.product && <NavLink to='/report/product'>{language['PRODUCT']}</NavLink>}
      {user?.privilege?.report?.staff && <NavLink to='/report/staff'>{language['STAFF']}</NavLink>}
      {user?.privilege?.operation?.transaction && <NavLink to='/sale/transaction'>{language['TRANSACTION']}</NavLink>}
      {/* {user?.privilege?.operation?.payment && <NavLink to='/sale/payment'>{language['PAYMENT']}</NavLink>} */}
    </>
  )
}

export default ReportNavbar