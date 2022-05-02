import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminNavbar = () => {
  return (
    <>
        <NavLink to='/admin/role'>Role</NavLink>
        <NavLink to='/admin/user'>User</NavLink>
    </>
  )
}

export default AdminNavbar