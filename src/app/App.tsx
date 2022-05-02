import { useRoutes } from 'react-router-dom'
import routes from './router'
import AuthProvider from 'contexts/auth/AuthContext'
import NotifyProvider from 'contexts/notify/NotifyContext'
import ThemesProvider from 'contexts/theme/ThemeContext'

const App = () => {
  let routers = useRoutes(routes)

  return (
    <ThemesProvider>
      <NotifyProvider>
        <AuthProvider>{routers}</AuthProvider>
      </NotifyProvider>
    </ThemesProvider>
  )
}

export default App
