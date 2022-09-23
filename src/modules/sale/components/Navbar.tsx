import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  return (
    <>
      {user?.privilege?.operation?.cashing && <NavLink to='/sale/cashing'>{language['CASHING']}</NavLink>}
      {user?.privilege?.operation?.reservation && <NavLink to='/sale/reservation'>{language['RESERVATION']}</NavLink>}
      {user?.privilege?.operation?.transaction && <NavLink to='/sale/transaction'>{language['TRANSACTION']}</NavLink>}
      {user?.privilege?.operation?.payment && <NavLink to='/sale/payment'>{language['PAYMENT']}</NavLink>}
      {user?.privilege?.operation?.stock && <NavLink to='/sale/stock'>{language['STOCK']}</NavLink>}
      {user?.privilege?.operation?.promotion && <NavLink to='/sale/promotion'>{language['PROMOTION']}</NavLink>}
    </>
  )
}

export default Navbar