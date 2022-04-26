import { createContext, useEffect, useReducer } from 'react'
import { generateHash } from 'utils'
import { AuthReducer } from './authReducer'
import axios from 'axios'
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
    const token = window.localStorage.getItem('x-access-token')
    const ts = Date.now().toString()
    const hash = await generateHash(data, ts, token || '')

    try {
      const response = await axios.post(
        'http://localhost:3030/auth/login',
        data,
        {
          headers: {
            'x-access-hash': hash,
            'x-access-ts': ts,
          },
        }
      )

      dispatch({ type: EnumAuth.LOGIN, payload: response.data.data })
      setSession(response.data.data.accessToken)
      navigate('/admin')
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
