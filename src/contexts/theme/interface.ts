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
  border: {
    primary: string,
    secondary: string
  },
  shadow: {
    container: string,
    primary: string,
    secondary: string,
    inset: string,
    bottom: string
  }
}

export interface IThemeStyle extends IThemeMode {
  radius: {
    primary: string,
    secondary: string,
    rounded: string,
    circle: string,
  },
  font: {
    family: string,
    weight: number
  },
  responsive: {
    mobile: {
      textSize: string | number
    },
    tablet: {
      textSize: string | number
    },
    laptop: {
      textSize: string | number
    },
    desktop: {
      textSize: string | number
    }
  }
}

export interface IThemeContext {
  mode: ThemeOptions,
  theme: IThemeStyle,
  changeTheme: Function
}

