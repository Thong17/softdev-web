import { createContext, useEffect, useReducer, useState } from 'react'
import { AuthReducer } from './authReducer'
import Axios from 'constants/functions/Axios'
import { EnumAuth } from './authReducer'
import { ILogin, IAuthInit, IRegister, IUser } from './interface'
import { useLocation, useNavigate } from 'react-router'
import { getProfile, setSession, setActiveStore } from './shared'
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
  switchStore: (storeId: string) => Promise.resolve(),
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

  // Force a user who belongs to multiple stores but hasn't picked one yet
  // (no activeStoreId resolved) to the store-picker screen before they can
  // reach anything else in the app.
  useEffect(() => {
    if (!state.isAuthenticated || !state.user || state.user.mustChangePassword) return
    const stores = state.user.stores || []
    const needsStoreSelection = stores.length > 1 && !state.user.activeStoreId
    if (!needsStoreSelection) return
    if (location.pathname !== '/select-store') navigate('/select-store', { replace: true })
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
      setActiveStore(response.data.user?.activeStoreId || null)
      return response.data

    } catch (err: any) {
      return err?.response?.data
    }
  }

  const switchStore = async (storeId: string) => {
    setActiveStore(storeId)
    await reload()
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
    setActiveStore(null)
    navigate('/login')
  }

  if (!state.isInit) return <Loading />
  return (
    <AuthContext.Provider value={{ ...state, reload, login, logout, register, updateUser, switchStore }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
