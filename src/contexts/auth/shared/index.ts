import axios from 'axios'
import { isValidToken, generateHash } from 'utils'
import { EnumAuth } from 'contexts/auth/authReducer'

export const setSession = (token) => {
  if (token) {
    localStorage.setItem('x-access-token', token)
    axios.defaults.headers.common['x-access-token'] = token
  } else {
    localStorage.removeItem('x-access-token')
    delete axios.defaults.headers.common['x-access-token']
  }
}

export const getProfile = async (dispatch) => {
  const token = window.localStorage.getItem('x-access-token')
  if (!isValidToken(token)) return dispatch({ type: EnumAuth.INIT, payload: { isAuthenticated: false, user: null } })

  try {
    setSession(token)
    const ts = new Date().toISOString()
    const hash = await generateHash({}, ts, token || '')
    const response = await axios.get("http://localhost:3030/user/profile", {
      headers: {
        "x-access-hash": hash,
        "x-access-ts": ts
      }
    })
    
    dispatch({ type: EnumAuth.INIT, payload: { isAuthenticated: true, user: response.data.data.user } })
  } catch (err) {
    dispatch({ type: EnumAuth.INIT, payload: { isAuthenticated: false, user: null } })
  }
}