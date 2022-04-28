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
  const { user } = useAuth()
  const { notify } = useNotify()
  const location = useLocation()
  const { route, action } = role

  const isAuthenticated = user?.privilege?.[route]?.[action]

  if (isAuthenticated) return <>{children}</>
  
  notify(`You don't have permission to access this page`, 'error')
  return <Navigate to="/login" state={{ from: location.pathname }} />
}

export default AuthGuard