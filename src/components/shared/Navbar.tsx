import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { Link } from 'react-router-dom'
import Profile from './Profile'
import useConfig from 'hooks/useConfig'
import {
  CustomMenubar,
  ListNavbar,
  ColumnNavbar,
  CustomNavbar,
  RowNavbar,
} from 'styles'
import useWeb from 'hooks/useWeb'
import { useState } from 'react'
import Footer from './Footer'

export const MenuBar = ({ theme, open, toggleSidebar }) => {
  return (
    <CustomMenubar styled={theme} open={open} onClick={() => toggleSidebar()}>
      <div></div>
      <div></div>
      <div></div>
    </CustomMenubar>
  )
}

const Navbar = ({ children }) => {
  const [navbar, setNavbar] = useState(false)
  const { user } = useAuth()
  const { theme } = useTheme()
  const { toggleSidebar, sidebar } = useConfig()
  const { device } = useWeb()

  const toggleNavbar = () => {
    setNavbar(!navbar)
  }

  return (
    <CustomNavbar
      className='navbar'
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      styled={theme}
      device={device}
      sidebar={
        device !== 'mobile' && device !== 'tablet' ? (sidebar ? 266 : 86) : 0
      }
    >
      {device === 'mobile' ? (
        <MenuBar
          theme={theme}
          open={navbar}
          toggleSidebar={toggleNavbar}
        ></MenuBar>
      ) : (
        <MenuBar
          theme={theme}
          open={sidebar}
          toggleSidebar={toggleSidebar}
        ></MenuBar>
      )}
      {device === 'mobile' ? (
        <RowNavbar styled={theme} style={{ height: navbar ? '50%' : 0 }}>
          <ColumnNavbar>
            {children}
          </ColumnNavbar>
          <Footer></Footer>
        </RowNavbar>
      ) : (
        <ListNavbar>{children}</ListNavbar>
      )}
      {user ? (
        <Profile username={user.username} picture={user.photo} />
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </CustomNavbar>
  )
}

export default Navbar
