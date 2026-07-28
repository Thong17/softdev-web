import { IBody } from 'shared/interface'

export interface IStoreBody {
  name: string,
  type?: string,
  tax?: number,
  font?: string,
  contact?: string,
  logo?: any,
  address?: string,
  other?: string,
}

export const initState: IStoreBody = {
  name: '',
  type: '',
  tax: undefined,
  font: '',
  contact: '',
  logo: null,
  address: '',
  other: '',
}

export const initStructure = {
  price: {
    value: 0,
    currency: 'USD',
    duration: '1h'
  }
}

export interface StoreState {
  list: IBody<any[]>
  listTransfer: IBody<any[]>
  structures: IBody<any[]>
  floors: IBody<any[]>
  layout: IBody<any>
  detail: IBody<IStoreBody>
}

export const initialState: StoreState = {
  list: {
    data: [],
    status: 'INIT',
    count: 0
  },
  listTransfer: {
    data: [],
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
