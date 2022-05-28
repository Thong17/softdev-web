import { LanguageOptions } from "contexts/language/interface";
import { ThemeOptions } from "contexts/theme/interface";

export interface IUser {
  id: string
  username: string
  privilege: object
  photo?: string
  theme?: ThemeOptions
  language?: LanguageOptions
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

export interface IRegister {
  username: string,
  email: string,
  role: string,
  password: string,
  confirm_password: string
}
