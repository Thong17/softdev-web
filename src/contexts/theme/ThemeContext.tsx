import { createContext, useMemo, useState } from 'react'
import { ThemeOptions, IThemeContext, IThemeMode } from './interface'
import { themeMode } from './constant'
import useAuth from 'hooks/useAuth'

const initMode: ThemeOptions = 'light'

export const ThemeContext = createContext<IThemeContext>({
  mode: initMode,
  theme: themeMode[initMode],
  changeTheme: (mode: ThemeOptions) => {},
})

const ThemesProvider = ({ children }) => {
  const { user } = useAuth()
  const [mode, setMode] = useState<ThemeOptions>(user?.theme || initMode)
  
  const theme = useMemo<IThemeMode>(() => {    
    return themeMode[mode]
  }, [mode])

  const changeTheme = (mode: ThemeOptions) => {
    setMode(mode)
  }

  return (
    <ThemeContext.Provider value={{ mode, theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemesProvider
