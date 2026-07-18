import { IAuthInit } from './interface'

export enum EnumAuth {
  INIT = 'INIT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  TENANT_SCOPE = 'TENANT_SCOPE'
}

export const AuthReducer = (state: IAuthInit, action: { type; payload }) => {
  const { type, payload } = action

  switch (type) {
    case EnumAuth.INIT: {
      const { isAuthenticated, user, companyId, storeId } = payload

      return {
        ...state,
        isInit: true,
        isAuthenticated,
        user,
        companyId: companyId || state.companyId,
        storeId: storeId || state.storeId,
      }
    }

    case EnumAuth.LOGIN: {
      const { user } = payload
      const companyId = user?.companyId || user?.company?._id || user?.company?.id
      const storeId = user?.storeId || user?.store?._id || user?.store?.id

      return {
        ...state,
        isInit: true,
        isAuthenticated: true,
        user,
        companyId: companyId || state.companyId,
        storeId: storeId || state.storeId,
      }
    }

    case EnumAuth.REGISTER: {
      return {
        ...state,
        isInit: true
      }
    }

    case EnumAuth.LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        companyId: undefined,
        storeId: undefined,
      }
    }

    case EnumAuth.TENANT_SCOPE: {
      const { companyId, storeId } = payload

      return {
        ...state,
        companyId,
        storeId,
      }
    }

    default: {
      return {
        ...state,
      }
    }
  }
}
