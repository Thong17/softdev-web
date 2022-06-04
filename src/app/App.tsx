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

const App = () => {
  let routers = useRoutes(routes)

  return (
    <Compose components={[NotifyProvider, AlertProvider, AuthProvider, LanguageProvider, ThemesProvider, ConfigProvider, WebProvider]}>
      {routers}
    </Compose>
  )
}

export default App
