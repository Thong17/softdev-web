import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const { language } = useLanguage()
  return (
    <>
      <NavLink to='/sale/cashing'>{language['CASHING']}</NavLink>
      <NavLink to='/sale/reservation'>{language['RESERVATION']}</NavLink>
      <NavLink to='/sale/stock'>{language['STOCK']}</NavLink>
      <NavLink to='/sale/promotion'>{language['PROMOTION']}</NavLink>
    </>
  )
}

export default Navbar