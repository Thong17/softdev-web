import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminNavbar = () => {
  const { language } = useLanguage()
  return (
    <>
        <NavLink to='/admin/role'>{language['ROLE']}</NavLink>
        <NavLink to='/admin/user'>{language['USER']}</NavLink>
    </>
  )
}

export default AdminNavbar