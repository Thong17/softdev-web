import useAuth from 'hooks/useAuth'
import useLanguage from 'hooks/useLanguage'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const { user } = useAuth()
  const { language } = useLanguage()
  return (
    <>
      {user?.privilege?.function?.queue && <NavLink to='/function/queue'>{language['QUEUE']}</NavLink>}
      {user?.privilege?.function?.promotion && <NavLink to='/function/promotion'>{language['PROMOTION']}</NavLink>}
    </>
  )
}

export default Navbar