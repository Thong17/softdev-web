import { IBody } from "shared/interface"

export interface IListRole {
  _id: string,
  name: object,
  description?: string,
  privilege?: object,
}

export interface ShareState {
  infoProduct: IBody<any>,
  capacityStructure: IBody<any>,
  listRole: IBody<IListRole[]>,
  listCodeProduct: IBody<any[]>,
  listBrand: IBody<any[]>,
  listCategory: IBody<any[]>,
  listPresetCash: IBody<any[]>,
  privilege: IBody<Object>,
  preRole: IBody<Object>,
  adminDashboard: IBody<any>
  organizeDashboard: IBody<any>
  operationDashboard: IBody<any>
  listProduct: IBody<any>
  listCustomer: IBody<any>
  listStructure: IBody<any>
}

export const initialState: ShareState = {
  infoProduct: {
    data: null,
    status: 'INIT',
  },
  capacityStructure: {
    data: null,
    status: 'INIT',
  },
  listRole: {
    data: [],
    status: 'INIT',
  },
  listCodeProduct: {
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
  listStructure: {
    data: [],
    status: 'INIT',
  },
  listPresetCash: {
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
  organizeDashboard: {
    data: {},
    status: 'INIT',
  },
  operationDashboard: {
    data: {},
    status: 'INIT',
  },
  listProduct: {
    data: [],
    status: 'INIT',
    count: 0,
    hasMore: true
  },
  listCustomer: {
    data: [],
    status: 'INIT',
    count: 0,
    hasMore: true
  },
}
