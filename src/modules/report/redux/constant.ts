import { IBody } from 'shared/interface'

interface ISaleReport {
  totalIncome: number
  totalProfit: number
  listSale: any[]
}

interface IProductReport {
  topProduct: number
  listProductSale: any[]
}

interface IStaffReport {
  totalStaff: number
  listStaff: any[]
}

export interface ReportState {
  sale: IBody<ISaleReport>
  product: IBody<IProductReport>
  staff: IBody<IStaffReport>
}

export const initialState: ReportState = {
  sale: {
    data: { totalIncome: 0, totalProfit: 0, listSale: [] },
    status: 'INIT',
  },
  product: {
    data: { topProduct: 0, listProductSale: [] },
    status: 'INIT',
  },
  staff: {
    data: { totalStaff: 0, listStaff: [] },
    status: 'INIT',
  },
}
