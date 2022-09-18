import { IBody } from 'shared/interface'

interface ISaleReport {
  totalIncome: number
  totalProfit: number
  listSale: any[]
}

interface IProductReport {
  topProduct: any
  listProductSale: any[]
}

interface IStaffReport {
  topStaff: any
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
    data: { topProduct: {}, listProductSale: [] },
    status: 'INIT',
  },
  staff: {
    data: { topStaff: {}, listStaff: [] },
    status: 'INIT',
  },
}
