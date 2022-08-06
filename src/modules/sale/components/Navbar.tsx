import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <NavLink to='/sale/cashing'>Cashing</NavLink>
      <NavLink to='/sale/reservation'>Reservation</NavLink>
      <NavLink to='/sale/stock'>Stock</NavLink>
      <NavLink to='/sale/promotion'>Promotion</NavLink>
    </>
  )
}

export default Navbar