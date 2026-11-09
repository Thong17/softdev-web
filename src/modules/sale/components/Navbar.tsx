import useAuth from 'hooks/useAuth'
import useStoreFeatures from 'hooks/useStoreFeatures'
import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const { user } = useAuth()
  const features = useStoreFeatures()
  const { language } = useLanguage()
  return (
    <>
      {user?.privilege?.operation?.cashing && <NavLink to='/sale/cashing'>{language['CASHING']}</NavLink>}
      {user?.privilege?.operation?.reservation && features.reservation && <NavLink to='/sale/reservation'>{language['RESERVATION']}</NavLink>}
      {user?.privilege?.operation?.stock && <NavLink to='/sale/stock'>{language['STOCK']}</NavLink>}
      {user?.privilege?.operation?.loan && <NavLink to='/sale/loan'>{language['LOAN']}</NavLink>}
      {user?.privilege?.operation?.payment && <NavLink to='/sale/payment'>{language['PAYMENT']}</NavLink>}
      {user?.privilege?.operation?.quotation && <NavLink to='/sale/quotation'>{language['QUOTATION']}</NavLink>}
    </>
  )
}

export default Navbar