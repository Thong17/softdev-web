export declare type ThemeOptions = 'light' | 'dark'

export interface IThemeMode {
  background: {
    primary: string,
    secondary: string
  },
  text: {
    primary: string,
    secondary: string
  },
  active: {
    primary: string,
    secondary: string
  },
  shadow: {
    container: string
  },
  border: string,
  radius: string
}

export interface IThemeContext {
  mode: ThemeOptions,
  theme: IThemeMode,
  changeTheme: Function
}

