import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
        <NavLink to='/store/category'>Category</NavLink>
        <NavLink to='/store/brand'>Brand</NavLink>
        <NavLink to='/store/product'>Product</NavLink>
    </>
  )
}

export default Navbar