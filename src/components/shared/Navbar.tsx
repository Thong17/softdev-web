import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { Link, useLocation } from 'react-router-dom'
import Profile from './Profile'
import useConfig from 'hooks/useConfig'
import {
  ListNavbar,
  RowNavbar,
  CustomNavbar,
  NavbarContainer,
} from 'styles'
import Dialog from './Dialog'
import useWeb from 'hooks/useWeb'
import { useEffect, useRef, useState } from 'react'
import Footer from './Footer'
import useLanguage from 'hooks/useLanguage'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { IconButton, Menu, MenuItem, Stack } from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

export const MenuBar = ({ toggleSidebar, theme }) => {
  return (
    <IconButton sx={{ color: theme.text.secondary }} onClick={() => toggleSidebar()}>
      <MenuRoundedIcon />
    </IconButton>
  )
}

const Navbar = ({ children }) => {
  const [navbar, setNavbar] = useState(false)
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { toggleSidebar, sidebar } = useConfig()
  const { device, width } = useWeb()
  const navRef = useRef<HTMLDivElement>(document.createElement('div'))
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const openNavbar = () => {
    setNavbar(true)
  }

  const closeNavbar = (event) => {
    !navRef.current.contains(event.target) && setNavbar(false)
  }

  useEffect(() => {
    setNavbar(false)
  }, [location])

  useEffect(() => {
    navbar && document.addEventListener('mousedown', closeNavbar)
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
          {children && <MenuBar
            theme={theme}
            toggleSidebar={openNavbar}
          ></MenuBar>}
        </div>
      ) : (
        <div style={{ display: 'flex' }}>
          <MenuBar
            theme={theme}
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
            {navbar && <RowNavbar>{children}</RowNavbar>}
            {navbar && <Footer></Footer>}
          </NavbarContainer>
        </Dialog>
      ) : (
        <ListNavbar>{children}</ListNavbar>
      )}
      {user?.id ? (
        <Stack direction={'row'} gap={2} alignItems={'center'}>
          <IconButton
            onClick={(event) => setAnchorEl(event.currentTarget)}
            style={{
              borderRadius: theme.radius.primary,
              color: theme.text.primary,
            }}
          >
            <NotificationsRoundedIcon />
          </IconButton>
          <Menu
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorEl={anchorEl}
            id='profile-menu'
            style={{
              marginTop: 10,
            }}
          >
            <MenuItem>
              Notification
            </MenuItem>
          </Menu>
          <Profile id={user.id} username={user.username} picture={user.photo} />
        </Stack>
      ) : (
        <Link to='/login'>{language['LOGIN']}</Link>
      )}
    </CustomNavbar>
  )
}

export default Navbar
