import { createContext, useEffect, useReducer } from 'react'
import { AuthReducer } from './authReducer'
import Axios from 'constants/functions/Axios'
import { EnumAuth } from './authReducer'
import { ILogin, IAuthInit } from './interface'
import { useNavigate } from 'react-router'
import { getProfile, setSession } from './shared'
import Loading from 'components/shared/Loading'

const initState: IAuthInit = {
  isInit: false,
  isAuthenticated: false,
  user: null,
}

export const AuthContext = createContext({
  ...initState,
  login: (data: ILogin) => Promise.resolve(),
  logout: () => {},
})

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(AuthReducer, initState)

  useEffect(() => {
    getProfile(dispatch)
  }, [])

  const login = async (data: ILogin) => {
    try {
      const response = await Axios({ method: 'POST', url: '/auth/login', body: data })

      dispatch({ type: EnumAuth.LOGIN, payload: response.data.data })
      setSession(response.data.data.accessToken)
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
  
  if (!state.isInit) return <Loading></Loading>
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
