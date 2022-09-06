import { IBody } from 'shared/interface'

export interface ReservationState {
  list: IBody<any[]>
}

export const initialState: ReservationState = {
  list: {
    data: [],
    status: 'INIT',
  },
}
