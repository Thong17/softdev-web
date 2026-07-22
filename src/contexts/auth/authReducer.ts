import { IAuthInit } from './interface'

export enum EnumAuth {
  INIT = 'INIT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  UPDATE_USER = 'UPDATE_USER'
}

export const AuthReducer = (state: IAuthInit, action: { type; payload }) => {
  const { type, payload } = action

  switch (type) {
    case EnumAuth.INIT: {
      const { isAuthenticated, user } = payload

      return {
        ...state,
        isInit: true,
        isAuthenticated,
        user,
      }
    }

    case EnumAuth.LOGIN: {
      const { user } = payload

      return {
        ...state,
        isInit: true,
        isAuthenticated: true,
        user,
      }
    }

    case EnumAuth.REGISTER: {
      return {
        ...state,
        isInit: true
      }
    }

    case EnumAuth.UPDATE_USER: {
      return {
        ...state,
        user: { ...state.user, ...payload },
      }
    }

    case EnumAuth.LOGOUT: {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }
    }

    default: {
      return {
        ...state,
      }
    }
  }
}
