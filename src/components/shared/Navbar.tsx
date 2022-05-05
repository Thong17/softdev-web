import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { Link } from 'react-router-dom'
import Profile from './Profile'
import { CustomNavbar } from 'styles'

const Navbar = ({ children }) => {
  const { user } = useAuth()
  const { theme } = useTheme()

  return (
    <CustomNavbar
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      styled={theme}
    >
      <div>{children}</div>
      {user ? (
        <Profile username={user.username} />
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </CustomNavbar>
  )
}

export default Navbar
