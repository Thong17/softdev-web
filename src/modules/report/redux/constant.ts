import { IBody } from 'shared/interface'

interface ISaleReport {
  totalIncome: number
  totalProfit: number
  listSale: any[]
}

export interface ReportState {
  sale: IBody<ISaleReport>
}

export const initialState: ReportState = {
  sale: {
    data: { totalIncome: 0, totalProfit: 0, listSale: [] },
    status: 'INIT',
  },
}
