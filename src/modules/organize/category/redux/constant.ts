import { IBody } from 'shared/interface'

export interface ICategoryBody {
  name: Object,
  status: boolean,
  icon: any,
  hasThermalPrinting: boolean,
  description: string,
}

export const initState: ICategoryBody = {
  name: {},
  status: true,
  icon: null,
  hasThermalPrinting: true,
  description: ''
}

export interface CategoryState {
  list: IBody<any[]>
  detail: IBody<ICategoryBody>
}

export const initialState: CategoryState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  }
}
