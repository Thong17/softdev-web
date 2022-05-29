export interface IUserBody {
  username: string,
  password: string,
  email: string,
  role: string,
}

export const initState: IUserBody = {
  username: '',
  password: '',
  email: '',
  role: ''
}