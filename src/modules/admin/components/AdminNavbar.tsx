import React from 'react'
import { NavLink } from 'react-router-dom'
import Navbar from 'components/shared/Navbar'

const AdminNavbar = () => {
  return (
    <Navbar>
        <NavLink to='/admin/role'>Role</NavLink>
        <NavLink to='/admin/user'>User</NavLink>
    </Navbar>
  )
}

export default AdminNavbar