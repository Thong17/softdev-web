import { IBody } from 'shared/interface'

export interface IProductBody {
  name: Object,
  price: Object,
  code: string | null,
  status: boolean,
  description: string,
  isStock: boolean,
  profile: any,
  brand: string | null,
  category: string | null,
  detail: string | null,
  colors: string[],
  options: string[],
  images: any[]
}

export const initState: IProductBody = {
  name: {},
  price: {},
  code: null,
  status: true,
  description: '',
  isStock: false,
  profile: null,
  brand: '',
  category: '',
  detail: null,
  colors: [],
  options: [],
  images: []
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
