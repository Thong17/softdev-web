import { IBody } from 'shared/interface'

export interface LoanState {
  list: IBody<Object[]>
}

export const initialState: LoanState = {
  list: {
    data: [],
    status: 'INIT',
    count: 0
  },
}
