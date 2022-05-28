export interface IRoleBody {
  role: object,
  description: string,
  privilege: object
}

export interface IBody<T> {
  data: T
  status: 'SUCCESS' | 'LOADING' | 'FAILED'
}

export interface RoleState {
  create: IBody<IRoleBody>,
  privilege: IBody<Object>,
  preRole: IBody<Object>
}

export const initRoleBody: IRoleBody = {
  role: {},
  description: '',
  privilege: {}
}

export const initialState: RoleState = {
  create: {
    data: initRoleBody,
    status: 'LOADING',
  },
  privilege: {
    data: {},
    status: 'LOADING',
  },
  preRole: {
    data: {},
    status: 'LOADING',
  },
}
