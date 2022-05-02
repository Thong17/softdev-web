import { createContext, useMemo, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DefaultTheme } from '@mui/system'

declare type ThemeOptions = 'light' | 'dark'

interface IThemeContext {
  mode: ThemeOptions,
  theme: Partial<DefaultTheme>,
  changeTheme: Function
}

const initMode: ThemeOptions = 'light'

export const ThemeContext = createContext<IThemeContext>({
  mode: initMode,
  theme: {},
  changeTheme: (mode: ThemeOptions) => {},
})

const ThemesProvider = ({ children }) => {
  const [mode, setMode] = useState<ThemeOptions>(initMode)
  
  const theme = useMemo((): Partial<DefaultTheme> => {
    return createTheme({
      palette: {
        mode: mode,
        background: {
          default: mode === 'light' ? '#891726' : '#098727'
        }
      }
    })
  }, [mode])

  const changeTheme = (mode: ThemeOptions) => {
    setMode(mode)
  }

  return (
    <ThemeContext.Provider value={{ mode, theme, changeTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemesProvider
