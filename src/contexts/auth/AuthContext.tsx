import { createContext, useEffect, useReducer, useState } from 'react'
import { AuthReducer } from './authReducer'
import Axios from 'constants/functions/Axios'
import { EnumAuth } from './authReducer'
import { ILogin, IAuthInit, IRegister } from './interface'
import { useNavigate } from 'react-router'
import { getProfile, setSession, setTenantScope } from './shared'
import Loading from 'components/shared/Loading'

const initState: IAuthInit = {
  isInit: false,
  isAuthenticated: false,
  user: null,
  companyId: undefined,
  storeId: undefined,
}

export const AuthContext = createContext({
  ...initState,
  reload: () => Promise.resolve(),
  login: (data: ILogin) => Promise.resolve(),
  register: (data: IRegister) => Promise.resolve(),
  logout: () => {},
  setTenantScope: (scope: { companyId?: string, storeId?: string }) => {},
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
      const user = response?.data?.user || response?.data || {}
      const companyId = user?.companyId || user?.company?._id || user?.company?.id
      const storeId = user?.storeId || user?.store?._id || user?.store?.id

      dispatch({ type: EnumAuth.LOGIN, payload: response.data })
      setSession(response.data.accessToken)
      setTenantScope({ companyId, storeId })
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
    setTenantScope()
    navigate('/login')
  }

  const handleSetTenantScope = (scope: { companyId?: string, storeId?: string } = {}) => {
    setTenantScope(scope)
    dispatch({ type: EnumAuth.TENANT_SCOPE, payload: scope })
  }
  
  if (!state.isInit) return <Loading />
  return (
    <AuthContext.Provider value={{ ...state, reload, login, logout, register, setTenantScope: handleSetTenantScope }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
