import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const { language } = useLanguage()
  return (
    <>
        <NavLink to='/organize/category'>{language['CATEGORY']}</NavLink>
        <NavLink to='/organize/brand'>{language['BRAND']}</NavLink>
        <NavLink to='/organize/product'>{language['PRODUCT']}</NavLink>
        <NavLink to='/organize/store'>{language['STORE']}</NavLink>
    </>
  )
}

export default Navbar