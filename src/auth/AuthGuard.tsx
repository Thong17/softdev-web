import useAuth from 'hooks/useAuth'
import useNotify from 'hooks/useNotify'
import React, { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface IAuthRoute {
  role: {
    route: string,
    action: string
  }
}

const AuthGuard: FC<IAuthRoute> = ({ children, role }) => {
  const { user, isInit } = useAuth()
  const { notify } = useNotify()
  const location = useLocation()
  const { route, action } = role

  let isAuthenticated = user?.privilege?.[route]?.[action]
  notify(`You don't have access to this page!`, 'error')
  if (isInit && !isAuthenticated) return <Navigate to="/login" state={{ redirectUrl: location.pathname }} />
  return <>{children}</>
}

export default AuthGuard