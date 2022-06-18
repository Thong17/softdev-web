import React from 'react'
import { NavLink } from 'react-router-dom'

const SaleNavbar = () => {
  return (
    <>
        <NavLink to='/sale/cashing'>Cashing</NavLink>
        <NavLink to='/sale/stock'>Stock</NavLink>
    </>
  )
}

export default SaleNavbar