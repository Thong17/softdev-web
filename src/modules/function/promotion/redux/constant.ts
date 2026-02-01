import { IBody } from 'shared/interface'

export interface IPromotionBody {
  description: Object,
  value: number,
  type?: string,
  isFixed: boolean,
  startAt?: boolean,
  expireAt?: boolean,
  products: any[]
}

export const initState: IPromotionBody = {
  description: {},
  value: 0,
  isFixed: false,
  products: []
}

export interface PromotionState {
  list: IBody<Object[]>
  detail: IBody<IPromotionBody>
}

export const initialState: PromotionState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  }
}
