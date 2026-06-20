import { useRoutes } from 'react-router-dom'
import routes from './router'
import Compose from 'contexts'
import AuthProvider from 'contexts/auth/AuthContext'
import NotifyProvider from 'contexts/notify/NotifyContext'
import ThemesProvider from 'contexts/theme/ThemeContext'
import LanguageProvider from 'contexts/language/LanguageContext'
import ConfigProvider from 'contexts/config/ConfigContext'
import WebProvider from 'contexts/web/WebContext'
import AlertProvider from 'contexts/alert/AlertContext'
import { useAppDispatch } from './hooks'
import { useEffect } from 'react'
import { getAlertNotification } from 'shared/redux'

const App = () => {
  let routers = useRoutes(routes)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // initial fetch
    dispatch(getAlertNotification())
    // poll every 1 minutes to refresh alert notifications
    const intervalId = setInterval(() => {
      dispatch(getAlertNotification())
    }, 1 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, [dispatch])

  return (
    <Compose components={[NotifyProvider, AlertProvider, AuthProvider, LanguageProvider, ThemesProvider, ConfigProvider, WebProvider]}>
      {routers}
    </Compose>
  )
}

export default App
