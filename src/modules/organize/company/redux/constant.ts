import { IBody } from 'shared/interface'

export interface ICompanyBody {
  name: Object,
  legalName: string,
  status: boolean,
  contact: string,
  email: string,
  address: string,
  logo: any,
}

export const initState: ICompanyBody = {
  name: {},
  legalName: '',
  status: true,
  contact: '',
  email: '',
  address: '',
  logo: null
}

export interface CompanyState {
  list: IBody<Object[]>
  detail: IBody<ICompanyBody>
}

export const initialState: CompanyState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  }
}
