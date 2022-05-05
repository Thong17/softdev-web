import { useRoutes } from 'react-router-dom'
import routes from './router'
import AuthProvider from 'contexts/auth/AuthContext'
import NotifyProvider from 'contexts/notify/NotifyContext'
import ThemesProvider from 'contexts/theme/ThemeContext'
import LanguageProvider from 'contexts/language/LanguageContext'
import ConfigProvider from 'contexts/config/ConfigContext'

const App = () => {
  let routers = useRoutes(routes)

  return (
    <NotifyProvider>
      <AuthProvider>
        <LanguageProvider>
          <ThemesProvider>
            <ConfigProvider>{routers}</ConfigProvider>
          </ThemesProvider>
        </LanguageProvider>
      </AuthProvider>
    </NotifyProvider>
  )
}

export default App
