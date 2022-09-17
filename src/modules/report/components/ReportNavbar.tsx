import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import { NavLink } from 'react-router-dom'

const ReportNavbar = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  return (
    <>
      {user?.privilege?.report?.sale && <NavLink to='/report/sale'>{language['SALE']}</NavLink>}
    </>
  )
}

export default ReportNavbar