export declare type ThemeOptions = 'Light' | 'Dark' | 'Blue'

export declare type TextOptions = {
  primary: string | number
  secondary?: string | number
  tertiary?: string | number
  quaternary?: string | number
  h5?: string | number
  h4?: string | number
  h3?: string | number
  h2?: string | number
  h1?: string | number
}

export interface IThemeMode {
  background: {
    primary: string
    secondary: string
    tertiary?: string
    quaternary?: string
  }
  text: {
    primary: string
    secondary: string
    tertiary?: string
    quaternary?: string
  }
  active: {
    primary: string
    secondary: string
    tertiary?: string
    quaternary?: string
  }
  border: {
    primary: string
    secondary: string
    tertiary: string
    quaternary?: string
    dashed?: string
  }
  shadow: {
    container: string
    primary: string
    secondary: string
    inset: string
    bottom: string
  }
}

export interface IThemeStyle extends IThemeMode {
  radius: {
    primary: string
    secondary: string
    ternary: string
    quaternary: string
    rounded: string
    circle: string
  }
  font: {
    family: string
    weight: number
  }
  color: {
    error: string,
    success: string,
    info: string,
    warning: string
  },
  responsive: {
    mobile: {
      text: TextOptions
    }
    tablet: {
      text: TextOptions
    }
    laptop: {
      text: TextOptions
    }
    desktop: {
      text: TextOptions
    }
  }
}

export interface IThemeContext {
  mode: ThemeOptions
  theme: IThemeStyle
  changeTheme: Function
}
