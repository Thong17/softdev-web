import { IBody } from 'shared/interface'

export interface PaymentState {
  list: IBody<Object[]>
}

export const initialState: PaymentState = {
  list: {
    data: [],
    status: 'INIT',
    count: 0
  }
}
