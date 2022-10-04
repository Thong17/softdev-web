import { createContext, useEffect, useMemo, useState } from 'react'
import { ThemeOptions, IThemeContext, IThemeStyle } from './interface'
import { themeMode, themeStyle } from './constant'
import useAuth from 'hooks/useAuth'
import Axios from 'constants/functions/Axios'
import useNotify from 'hooks/useNotify'
import 'assets/styles/index.css'

const initMode: ThemeOptions = localStorage.getItem('setting-theme') as ThemeOptions || 'Light'

export const ThemeContext = createContext<IThemeContext>({
  mode: initMode,
  theme: { ...themeMode[initMode], ...themeStyle },
  changeTheme: (mode: ThemeOptions) => {},
})

const ThemesProvider = ({ children }) => {
  const { user } = useAuth()
  const [mode, setMode] = useState<ThemeOptions>(initMode)
  const { notify } = useNotify()

  useEffect(() => {
    const userTheme: ThemeOptions = user?.theme || initMode
    setMode(userTheme)
    localStorage.setItem('setting-theme', userTheme)
  }, [user?.theme])

  const theme = useMemo<IThemeStyle>(() => {
    document.body.style.backgroundColor = themeMode[mode]?.background?.primary
    return { ...themeMode[mode], ...themeStyle }
  }, [mode])

  const changeTheme = async (mode: ThemeOptions) => {
    const response = await Axios({
      method: 'POST',
      url: `/user/theme/change`,
      body: { theme: mode },
    })

    if (response?.data?.code !== 'SUCCESS') {
      return notify(response.data.msg, 'error')
    }
    setMode(response.data.theme)
    localStorage.setItem('setting-theme', response.data.theme)
  }

  return (
    <ThemeContext.Provider value={{ mode, theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemesProvider
