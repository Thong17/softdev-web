import { IBody } from "shared/interface"

export interface IListRole {
  _id: string,
  name: object,
  description?: string,
  privilege?: object,
}

export interface ShareState {
  listRole: IBody<IListRole[]>,
  listBrand: IBody<any[]>,
  listCategory: IBody<any[]>,
  privilege: IBody<Object>,
  preRole: IBody<Object>,
  adminDashboard: IBody<any>
  listProduct: IBody<any>
}

export const initialState: ShareState = {
  listRole: {
    data: [],
    status: 'INIT',
  },
  listBrand: {
    data: [],
    status: 'INIT',
  },
  listCategory: {
    data: [],
    status: 'INIT',
  },
  privilege: {
    data: {},
    status: 'INIT',
  },
  preRole: {
    data: {},
    status: 'INIT',
  },
  adminDashboard: {
    data: {},
    status: 'INIT',
  },
  listProduct: {
    data: [],
    status: 'INIT',
    count: 0,
    hasMore: true
  },
}
