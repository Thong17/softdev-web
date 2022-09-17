import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  return (
    <>
        {user?.privilege?.organize?.category && <NavLink to='/organize/category'>{language['CATEGORY']}</NavLink>}
        {user?.privilege?.organize?.brand && <NavLink to='/organize/brand'>{language['BRAND']}</NavLink>}
        {user?.privilege?.organize?.product && <NavLink to='/organize/product'>{language['PRODUCT']}</NavLink>}
        {user?.privilege?.organize?.store && <NavLink to='/organize/store'>{language['STORE']}</NavLink>}
    </>
  )
}

export default Navbar