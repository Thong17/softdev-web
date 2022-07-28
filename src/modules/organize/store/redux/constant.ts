import { IBody } from 'shared/interface'

export interface IStoreBody {
  name: Object,
  status: boolean,
  icon: any,
  description: string,
}

export const initState: IStoreBody = {
  name: {},
  status: true,
  icon: null,
  description: ''
}

export interface StoreState {
  list: IBody<Object[]>
  detail: IBody<IStoreBody>
}

export const initialState: StoreState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  }
}
