import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
        <NavLink to='/organize/category'>Category</NavLink>
        <NavLink to='/organize/brand'>Brand</NavLink>
        <NavLink to='/organize/product'>Product</NavLink>
        <NavLink to='/organize/store'>Store</NavLink>
    </>
  )
}

export default Navbar