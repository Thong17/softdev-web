import { useRoutes } from 'react-router-dom'
import routes from './router'
import AuthProvider from 'contexts/auth/AuthContext'
import NotifyProvider from 'contexts/notify/NotifyContext'
const App = () => {
  let routers = useRoutes(routes)

  return (
    <NotifyProvider>
      <AuthProvider>{routers}</AuthProvider>
    </NotifyProvider>
  )
}

export default App
