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
  store: IBody<any>
  structures: IBody<any[]>
  floors: IBody<any[]>
  layout: IBody<any>
  detail: IBody<IStoreBody>
}

export const initialState: StoreState = {
  store: {
    data: null,
    status: 'INIT',
  },
  structures: {
    data: [],
    status: 'INIT',
  },
  floors: {
    data: [],
    status: 'INIT',
  },
  layout: {
    data: null,
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  }
}
