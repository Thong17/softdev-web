import useLanguage from 'hooks/useLanguage'
import { NavLink } from 'react-router-dom'

const ReportNavbar = () => {
  const { language } = useLanguage()
  return (
    <>
      <NavLink to='/report/sale'>{language['SALE']}</NavLink>
    </>
  )
}

export default ReportNavbar