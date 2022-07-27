import { IBody } from 'shared/interface'

export interface UserState {
  list: IBody<Object[]>
  detail: IBody<any>,
}

export const initialState: UserState = {
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
