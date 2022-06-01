import { IBody } from 'shared/interface'

export interface IBrandBody {
  name: Object,
  status: boolean,
  icon: any,
  description: string,
}

export const initState: IBrandBody = {
  name: {},
  status: true,
  icon: null,
  description: ''
}

export interface BrandState {
  list: IBody<Object[]>
  detail: IBody<IBrandBody>
}

export const initialState: BrandState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  }
}
