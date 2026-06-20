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
import useNotify from 'hooks/useNotify'
import Footer from './Footer'
import useLanguage from 'hooks/useLanguage'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { Badge, IconButton, Menu, MenuItem, Stack, Avatar, Typography, Divider } from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { calculateDay } from 'utils/index'
import { CONSTANT } from 'constants/variables'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getAlertNotification, selectAlertNotification, updateAlertNotification } from 'shared/redux'

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
  const { data: { notifications, isFirstLoaded, notificationStates, prevNotificationStates } } = useAppSelector(selectAlertNotification)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const [bumped, setBumped] = useState(false)

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
    const currentMap = (notificationStates || []).reduce((acc: Record<string, string>, n: any) => {
      acc[n._id] = n.updatedAt
      return acc
    }, {})

    // skip on first load
    if (isFirstLoaded) {
      dispatch(updateAlertNotification({ isFirstLoaded: false, prevNotificationStates: notificationStates }))
      return
    }

    const changedIds: string[] = []
    for (const id in currentMap) {
      if (!prevNotificationStates[id] || prevNotificationStates[id] !== currentMap[id]) {
        changedIds.push(id)
      }
    }

    dispatch(updateAlertNotification({ prevNotificationStates: currentMap }))

    if (changedIds.length > 0) {
      setBumped(true)
      const changedItems = (notificationStates || []).filter((n: any) => changedIds.includes(n._id))
      changedItems.forEach((item: any) => {
        const name = item.name?.English
        const shouldExpire = item.expireAt && calculateDay(new Date(item.expireAt), Date.now())
        let description: string[] = []
        if (shouldExpire < 0) description.push('has expired')
        else if (item.expireAt && shouldExpire < CONSTANT.numberExpireDay) description.push('almost expire')

        if (item.quantity < item.alertAt) description.push(`only ${item.quantity} left`)
        notify(`${name} ` + description.join(', '), 'warning', { position: 'top-left' })
      })
      // stop bump after animation duration
      const t = setTimeout(() => setBumped(false), 2000)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationStates, notify])

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
              sx={{
                top: '-10px',
                left: '18px',
                transform: bumped ? 'scale(1.25)' : 'scale(1)',
                transition: 'transform 0.35s ease',
              }}
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
              notifications.map((notify: any) => {
                const item = mapData(notify)
                return <MenuItem key={item._id} style={{ padding: '8px 12px', minWidth: 320 }} onClick={() => handleClickNotification(item)}>
                  <Stack direction={'row'} gap={1} alignItems={'center'} sx={{ width: '100%' }}>
                    <Avatar sx={{ width: 40, height: 40 }} src={`${process.env.REACT_APP_API_UPLOADS}${item.product?.images?.[0]?.filename}`}>
                      {item.product?.name?.English?.charAt(0) || 'N'}
                    </Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Typography style={{ fontSize: 13, fontWeight: 600, color: theme.text.secondary }} noWrap>
                        {item.product?.name?.English || item.product?.name || 'Product'}
                      </Typography>
                      <Typography style={{ fontSize: 12, color: item.quantity > 0 ? theme.color.warning : theme.color.error }} noWrap>
                        Quantity: {item.quantity} / Alert At: {item.alertAt}
                      </Typography>
                      {item.expireAt && (
                        <Typography style={{ fontSize: 11, color: item.expireDay > CONSTANT.numberExpireDay ? theme.text.secondary : theme.color.error }}>
                          Expire: {new Date(item.expireAt).toDateString()}
                        </Typography>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Typography style={{ fontSize: 13, color: theme.text.secondary }}>
                        {item.cost} {item.currency}
                      </Typography>
                    </div>
                  </Stack>
                </MenuItem>
              })
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
