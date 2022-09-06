import { IBody } from 'shared/interface'

export interface ReservationState {
  list: IBody<any[]>
  detail: IBody<any>
}

export const initialState: ReservationState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: null,
    status: 'INIT',
  },
}
