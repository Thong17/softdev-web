import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { Link } from 'react-router-dom'
import Profile from './Profile'
import { CustomNavbar } from 'styles'
import useConfig from 'hooks/useConfig'
import { CustomMenubar, ListNavbar } from 'styles'
import useWeb from 'hooks/useWeb'

export const MenuBar = ({ theme, open, toggleSidebar }) => {
  return (
    <CustomMenubar
      styled={theme}
      open={open}
      onClick={() => toggleSidebar()}
    >
      <div></div>
      <div></div>
      <div></div>
    </CustomMenubar>
  )
}

const Navbar = ({ children }) => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { toggleSidebar, sidebar } = useConfig()
  const { device } = useWeb()

  const toggleNavbar = () => {
    console.log('toggle');
    
  }

  return (
    <CustomNavbar
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      styled={theme}
      device={device}
    >
      {device === 'mobile' ? (
        <MenuBar
          theme={theme}
          open={false}
          toggleSidebar={toggleNavbar}
        ></MenuBar>
      ) : (
        <MenuBar
          theme={theme}
          open={sidebar}
          toggleSidebar={toggleSidebar}
        ></MenuBar>
      )}
      {device !== 'mobile' && <ListNavbar>{children}</ListNavbar>}
      {user ? (
        <Profile username={user.username} picture={user.photo} />
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </CustomNavbar>
  )
}

export default Navbar
