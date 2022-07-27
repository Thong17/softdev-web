import logo from '../../assets/logo.jpg'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { Link } from 'react-router-dom'
import Profile from './Profile'
import useConfig from 'hooks/useConfig'
import {
  CustomMenubar,
  ListNavbar,
  RowNavbar,
  CustomNavbar,
  NavbarContainer,
} from 'styles'
import Dialog from './Dialog'
import useWeb from 'hooks/useWeb'
import { useEffect, useRef, useState } from 'react'
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
  const { device, width } = useWeb()
  const navRef = useRef<HTMLDivElement>(document.createElement("div"))

  const openNavbar = () => {
    setNavbar(true)
  }

  const closeNavbar = (event) => {
    !navRef.current.contains(event.target) && setNavbar(false)
  }

  useEffect(() => {
    navbar && 
      document.addEventListener('mousedown', closeNavbar)
    return () => {
      document.removeEventListener('mousedown', closeNavbar)
    }
  }, [navbar])

  return (
    <CustomNavbar
      className='navbar'
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      styled={theme}
      device={device}
      sidebar={
        device !== 'mobile' && device !== 'tablet' ? (sidebar ? 258 : 78) : 0
      }
    >
      {width < 1024 ? (
        <div style={{ display: 'flex' }}>
          <MenuBar
            theme={theme}
            open={navbar}
            toggleSidebar={openNavbar}
          ></MenuBar>
        </div>
        
      ) : (
        <div style={{ display: 'flex' }}>
          <MenuBar
            theme={theme}
            open={sidebar}
            toggleSidebar={toggleSidebar}
          ></MenuBar>
        </div>
      )}
      {width < 1024 ? (
        <Dialog display={navbar}>
          <NavbarContainer
            ref={navRef}
            styled={theme}
            style={{ height: navbar ? '50%' : 0 }}
          >
            <RowNavbar>{children}</RowNavbar>
            <Footer></Footer>
          </NavbarContainer>
        </Dialog>
      ) : (
        <ListNavbar>{children}</ListNavbar>
      )}
      {user?.id ? (
        <Profile username={user.username} picture={user.photo} />
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </CustomNavbar>
  )
}

export default Navbar
