import { IBody } from 'shared/interface'

export interface IProductBody {
  name: Object,
  price: number | null,
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
  price: null,
  currency: 'USD',
  code: '',
  status: true,
  description: '',
  isStock: false,
  profile: null,
  brand: '',
  category: '',
}

export interface ProductState {
  list: IBody<Object[]>
  detail: IBody<IProductBody>
}

export const initialState: ProductState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  }
}
