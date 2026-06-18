import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
import { Badge, IconButton, Menu, MenuItem, Stack, Avatar, Typography, Divider } from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import Axios from 'constants/functions/Axios'
import { calculateDay } from 'utils/index'
import { CONSTANT } from 'constants/variables'

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
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate()

  const openNavbar = () => {
    setNavbar(true)
  }

  const handleClickNotification = (data: any) => {
    setAnchorEl(null)
    if (data.type === 'stock') return navigate(`/sale/stock/item/${data.product?._id}`)
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

  const mapData = (data) => {
    const expireDay = calculateDay(new Date(data.expireAt), Date.now())
    return {
      ...data,
      expireDay
    }
  }

  useEffect(() => {
    Axios({
      method: 'GET',
      url: '/alert/notification',
    }).then((response) => {
      setNotifications(response.data?.data?.map(item => mapData(item)))
    }).catch(console.error)
  }, [])

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
            <Badge
              badgeContent={notifications?.length}
              color="error"
              max={9}
              sx={{ top: '-10px', left: '18px' }}
            >
            </Badge>
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
            PaperProps={{ sx: { borderRadius: theme.radius.quaternary, backgroundColor: theme.background.secondary } }}
          >
            {notifications?.length > 0 ? (
              notifications.map((n: any) => (
                <MenuItem key={n._id} style={{ padding: '8px 12px', minWidth: 320 }} onClick={() => handleClickNotification(n)}>
                  <Stack direction={'row'} gap={1} alignItems={'center'} sx={{ width: '100%' }}>
                    <Avatar sx={{ width: 40, height: 40 }} src={`${process.env.REACT_APP_API_UPLOADS}${n.product?.images?.[0]?.filename}`}>
                      {n.product?.name?.English?.charAt(0) || 'N'}
                    </Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Typography style={{ fontSize: 13, fontWeight: 600, color: theme.text.secondary }} noWrap>
                        {n.product?.name?.English || n.product?.name || 'Product'}
                      </Typography>
                      <Typography style={{ fontSize: 12, color: n.quantity > 0 ? theme.color.warning : theme.color.error }} noWrap>
                        Quantity: {n.quantity} / Alert At: {n.alertAt}
                      </Typography>
                      {n.expireAt && (
                        <Typography style={{ fontSize: 11, color: n.expireDay > CONSTANT.numberExpireDay ? theme.text.secondary : theme.color.error }}>
                          Expire: {new Date(n.expireAt).toDateString()}
                        </Typography>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Typography style={{ fontSize: 13, color: theme.text.secondary }}>
                        {n.cost} {n.currency}
                      </Typography>
                    </div>
                  </Stack>
                </MenuItem>
              ))
            ) : (
              <MenuItem style={{ minWidth: 240 }}>
                <Typography style={{ fontSize: 13, color: theme.text.quaternary, textAlign: 'center', width: '100%' }}>No notifications</Typography>
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)}>
              <Typography style={{ fontSize: 13, textAlign: 'center', width: '100%', color: theme.text.secondary }}>Close</Typography>
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
