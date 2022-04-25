export interface IUser {
  id: string
  username: string
  privilege: object
  photo: string
  theme: string
  language: string
}

export interface IAuthInit {
  isInit: boolean
  isAuthenticated: boolean
  user: IUser | null
}

export interface IToken {
  id: string
  exp: number
  iat: number
}

export interface ILogin {
  username: string
  password: string
}
