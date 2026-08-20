import { IBody } from 'shared/interface'

export interface IAnnouncementBody {
  title: Object,
  description?: Object,
  banner?: any,
  status?: boolean,
  startAt?: string,
  expireAt?: string,
  order?: number,
}

export const initState: IAnnouncementBody = {
  title: {},
  description: {},
  status: false,
  order: 0,
}

export interface AnnouncementState {
  list: IBody<Object[]>
  detail: IBody<IAnnouncementBody>
}

export const initialState: AnnouncementState = {
  list: {
    data: [],
    status: 'INIT',
  },
  detail: {
    data: initState,
    status: 'INIT',
  }
}
