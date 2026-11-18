import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminNavbar = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  return (
    <>
        {user?.privilege?.admin?.role && <NavLink to='/admin/role'>{language['ROLE']}</NavLink>}
        {user?.privilege?.admin?.user && <NavLink to='/admin/user'>{language['USER']}</NavLink>}
        {user?.privilege?.admin?.migration && <NavLink to='/admin/migration'>{language['MIGRATION']}</NavLink>}
    </>
  )
}

export default AdminNavbar