import { IImage } from 'components/shared/form/UploadField'
import { IBody } from 'shared/interface'

export interface IProductBody {
  name: Object,
  price?: number,
  currency: string,
  status: boolean,
  description: string,
  isStock: boolean,
  brand: string | null,
  category: string | null,
  images: IImage[],
  colors?: Object[],
  properties?: Object[],
  options?: Object[],
  customers?: Object[]
}

export const initState: IProductBody = {
  name: {},
  currency: 'USD',
  price: undefined,
  status: true,
  description: '',
  isStock: false,
  brand: '',
  category: '',
  images: []
}

export interface StockState {
  stocks: IBody<any[]>
  product: IBody<IProductBody>
  detail: IBody<Object>
}

export const initialState: StockState = {
  stocks: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: {},
    status: 'INIT',
  },
  product: {
    data: initState,
    status: 'INIT',
  },
}
