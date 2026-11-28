import Axios from 'constants/functions/Axios'
import { isValidToken } from 'utils'
import { EnumAuth } from 'contexts/auth/authReducer'

// The last profile the server sent, so the app opens with no connection
// (offline customer onboarding). Cleared on logout.
const CACHED_USER_KEY = 'offline-user'
// How long the app keeps working on the saved profile with no connection
const OFFLINE_SESSION_DAYS = 14

export const setSession = (token) => {
  if (token) {
    localStorage.setItem('x-access-token', token)
  } else {
    localStorage.removeItem('x-access-token')
    localStorage.removeItem(CACHED_USER_KEY)
  }
}

export const cacheUser = (user) => {
  if (!user) return
  try {
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify({ user, savedAt: Date.now() }))
  } catch {
    // Storage full or blocked: the app just won't open offline
  }
}

const cachedUser = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHED_USER_KEY) || 'null')
    if (!cached?.user || Date.now() - cached.savedAt > OFFLINE_SESSION_DAYS * 24 * 60 * 60 * 1000) return null
    return cached.user
  } catch {
    return null
  }
}

const validToken = (token) => {
  try {
    return isValidToken(token)
  } catch {
    return false
  }
}

export const getProfile = async (dispatch) => {
  const token = localStorage.getItem('x-access-token')
  const offlineUser = token ? cachedUser() : null
  // An expired login still opens offline on the saved profile; the server
  // asks for a new login once it can be reached
  if (!validToken(token) && !offlineUser)
    return dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: false, user: null },
    })

  try {
    const response = await Axios({ method: 'GET', url: '/user/profile' })
    cacheUser(response.data.user)

    dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: true, user: response.data.user },
    })
  } catch (err: any) {
    // No answer at all: no connection, so carry on with the saved profile
    if (!err?.response && offlineUser) {
      return dispatch({
        type: EnumAuth.INIT,
        payload: { isAuthenticated: true, user: offlineUser },
      })
    }
    dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: false, user: null },
    })
  }
}
