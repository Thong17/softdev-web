import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { Link } from 'react-router-dom'
import Profile from './Profile'
import { CustomNavbar } from 'styles'
import useConfig from 'hooks/useConfig'
import { CustomMenubar, ListNavbar } from 'styles'

const Navbar = ({ children }) => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { toggleSidebar, sidebar } = useConfig()

  return (
    <CustomNavbar
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      styled={theme}
    >
      <CustomMenubar styled={theme} open={sidebar} onClick={() => toggleSidebar()}>
        <div></div>
        <div></div>
        <div></div>
      </CustomMenubar>
      <ListNavbar>{children}</ListNavbar>
      {user ? (
        <Profile username={user.username} picture={user.photo} />
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </CustomNavbar>
  )
}

export default Navbar
