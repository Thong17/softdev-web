import { IBody } from 'shared/interface'

export interface RoleState {
  list: IBody<Object[]>
  detail: IBody<any>,
  privilege: IBody<Object>,
  preRole: IBody<Object>
}

export const initialState: RoleState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  },
  privilege: {
    data: {},
    status: 'INIT',
  },
  preRole: {
    data: {},
    status: 'INIT',
  },
}
