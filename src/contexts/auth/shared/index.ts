import Axios from 'constants/functions/Axios'
import { isValidToken } from 'utils'
import { EnumAuth } from 'contexts/auth/authReducer'

export const setSession = (token) => {
  if (token) {
    localStorage.setItem('x-access-token', token)
  } else {
    localStorage.removeItem('x-access-token')
    localStorage.removeItem('x-company-id')
    localStorage.removeItem('x-store-id')
  }
}

export const setTenantScope = ({ companyId, storeId }: { companyId?: string, storeId?: string } = {}) => {
  if (companyId) {
    localStorage.setItem('x-company-id', companyId)
  } else {
    localStorage.removeItem('x-company-id')
  }

  if (storeId) {
    localStorage.setItem('x-store-id', storeId)
  } else {
    localStorage.removeItem('x-store-id')
  }
}

export const getProfile = async (dispatch) => {
  const token = localStorage.getItem('x-access-token')
  if (!isValidToken(token)) {
    setSession(null)
    return dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: false, user: null },
    })
  }

  try {
    setSession(token)
    const response = await Axios({ method: 'GET', url: '/user/profile' })
    const profileUser = response?.data?.user || response?.data || {}
    const companyId = profileUser?.companyId || profileUser?.company?._id || profileUser?.company?.id
    const storeId = profileUser?.storeId || profileUser?.store?._id || profileUser?.store?.id

    setTenantScope({ companyId, storeId })

    dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: true, user: profileUser },
    })
  } catch (err) {
    dispatch({
      type: EnumAuth.INIT,
      payload: { isAuthenticated: false, user: null },
    })
  }
}
