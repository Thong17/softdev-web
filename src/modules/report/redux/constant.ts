import { IBody } from 'shared/interface'

export interface ReportState {
  sale: IBody<Object>
}

export const initialState: ReportState = {
  sale: {
    data: {},
    status: 'INIT',
  },
}
