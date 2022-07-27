import { IBody } from 'shared/interface'

export interface RoleState {
  list: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: RoleState = {
  list: {
    data: [],
    status: 'INIT',
    count: 0
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}
