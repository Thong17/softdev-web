import { IBody } from 'shared/interface'

export interface QueueState {
  list: IBody<Object[]>
}

export const initialState: QueueState = {
  list: {
    data: [],
    status: 'INIT',
    count: 0
  },
}
