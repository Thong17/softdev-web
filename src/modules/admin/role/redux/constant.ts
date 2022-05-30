import { IBody } from 'shared/interface'

export interface RoleState {
  list: IBody<Object[]>
  detail: IBody<any>
}

export const initialState: RoleState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  }
}
