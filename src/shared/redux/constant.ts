import { IBody } from "shared/interface"

export interface IListRole {
  _id: string,
  name: object,
  description?: string,
  privilege?: object,
}

export interface ShareState {
  listRole: IBody<IListRole[]>
}

export const initialState: ShareState = {
  listRole: {
    data: [],
    status: 'INIT',
  }
}
