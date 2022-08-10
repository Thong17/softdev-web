import { createContext, useEffect, useReducer, useState } from 'react'
import { AuthReducer } from './authReducer'
import Axios from 'constants/functions/Axios'
import { EnumAuth } from './authReducer'
import { ILogin, IAuthInit, IRegister } from './interface'
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
  reload: () => Promise.resolve(),
  login: (data: ILogin) => Promise.resolve(),
  register: (data: IRegister) => Promise.resolve(),
  logout: () => {},
})

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(AuthReducer, initState)
  const [toggleReload, setToggleReload] = useState(true)
  
  useEffect(() => {
    getProfile(dispatch)
  }, [toggleReload])

  const reload = async () => {
    setToggleReload(!toggleReload)
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
    <AuthContext.Provider value={{ ...state, reload, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
