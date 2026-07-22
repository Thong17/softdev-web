import { createContext, useEffect, useReducer, useState } from 'react'
import { AuthReducer } from './authReducer'
import Axios from 'constants/functions/Axios'
import { EnumAuth } from './authReducer'
import { ILogin, IAuthInit, IRegister, IUser } from './interface'
import { useLocation, useNavigate } from 'react-router'
import { getProfile, setSession } from './shared'
import Loading from 'components/shared/Loading'

const initState: IAuthInit = {
  isInit: false,
  isAuthenticated: false,
  user: null,
}

export const AuthContext = createContext({
  ...initState,
  reload: () => Promise.resolve(),
  login: (data: ILogin) => Promise.resolve(),
  register: (data: IRegister) => Promise.resolve(),
  logout: () => {},
  updateUser: (data: Partial<IUser>) => {},
})

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [state, dispatch] = useReducer(AuthReducer, initState)
  const [toggleReload, setToggleReload] = useState(true)

  useEffect(() => {
    getProfile(dispatch)
  }, [toggleReload])

  // Force a user flagged mustChangePassword (e.g. a default/seeded or
  // batch-imported account) to the change-password screen before they can
  // reach anything else in the app.
  useEffect(() => {
    if (!state.isAuthenticated || !state.user?.mustChangePassword) return
    const forcedPath = `/change-password/${state.user.id}`
    if (location.pathname !== forcedPath) navigate(forcedPath, { replace: true })
  }, [state.isAuthenticated, state.user, location.pathname, navigate])

  const reload = async () => {
    setToggleReload(!toggleReload)
  }

  const updateUser = (data: Partial<IUser>) => {
    dispatch({ type: EnumAuth.UPDATE_USER, payload: data })
  }

  const login = async (data: ILogin) => {
    try {
      const response = await Axios({ method: 'POST', url: '/auth/login', body: data })

      dispatch({ type: EnumAuth.LOGIN, payload: response.data })
      setSession(response.data.accessToken)
      return response.data

    } catch (err: any) {      
      return err?.response?.data
    }
  }

  const register = async (data: IRegister) => {
    try {
      const response = await Axios({ method: 'POST', url: '/auth/register', body: data })

      dispatch({ type: EnumAuth.REGISTER, payload: null })
      return response.data

    } catch (err: any) {      
      return err?.response?.data
    }
  }

  const logout = () => {
    dispatch({ type: EnumAuth.LOGOUT, payload: null })
    setSession(null)
    navigate('/login')
  }
  
  if (!state.isInit) return <Loading />
  return (
    <AuthContext.Provider value={{ ...state, reload, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
