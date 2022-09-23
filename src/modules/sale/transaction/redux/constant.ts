import { IBody } from 'shared/interface'

export interface TransactionState {
  list: IBody<Object[]>
}

export const initialState: TransactionState = {
  list: {
    data: [],
    status: 'INIT',
  }
}
