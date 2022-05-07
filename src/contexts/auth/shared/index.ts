import Axios from 'constants/functions/Axios'
import { isValidToken } from 'utils'
import { EnumAuth } from 'contexts/auth/authReducer'

export const setSession = (token) => {
  if (token) {
    localStorage.setItem('x-access-token', token)
  } else {
    localStorage.removeItem('x-access-token')
  }
}

export const getProfile = async (dispatch) => {
  const token = localStorage.getItem('x-access-token')
  if (!isValidToken(token))
    return dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: false, user: null },
    })

  try {
    setSession(token)
    const response = await Axios({ method: 'GET', url: '/user/profile' })

    dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: true, user: response.data.user },
    })
  } catch (err) {
    dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: false, user: null },
    })
  }
}
