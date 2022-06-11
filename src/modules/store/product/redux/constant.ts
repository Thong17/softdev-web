import { IBody } from 'shared/interface'

export interface IProductBody {
  name: Object,
  price?: number,
  currency: string,
  code: string,
  status: boolean,
  description: string,
  isStock: boolean,
  profile: any,
  brand: string | null,
  category: string | null,
}

export const initState: IProductBody = {
  name: {},
  currency: 'USD',
  price: undefined,
  code: '',
  status: true,
  description: '',
  isStock: false,
  profile: '',
  brand: '',
  category: '',
}

export interface ProductState {
  list: IBody<Object[]>
  detail: IBody<IProductBody>
  single: IBody<any>
}

export const initialState: ProductState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  },
  single: {
    data: initState,
    status: 'INIT',
  },
}
