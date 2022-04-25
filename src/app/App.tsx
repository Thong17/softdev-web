import { useRoutes } from 'react-router-dom'
import routes from './router'
import AuthProvider from 'contexts/auth/AuthContext'
import NotificationProvider from 'contexts/notify/NotificationContext'

const App = () => {
  let routers = useRoutes(routes)

  return (
    <NotificationProvider>
      <AuthProvider>{routers}</AuthProvider>
    </NotificationProvider>
  )
}

export default App
