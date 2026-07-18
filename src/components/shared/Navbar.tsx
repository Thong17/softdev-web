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
import { useEffect, useMemo, useRef, useState } from 'react'
import useNotify from 'hooks/useNotify'
import Footer from './Footer'
import useLanguage from 'hooks/useLanguage'
import { keyframes } from '@emotion/react'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import { Badge, IconButton, Menu, MenuItem, Stack, Avatar, Typography, Divider, FormControl, Select } from '@mui/material'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { calculateDay } from 'utils/index'
import { CONSTANT } from 'constants/variables'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectAlertNotification, updateAlertNotification } from 'shared/redux'
import { playBellSound } from 'utils/notify'
import Axios from 'constants/functions/Axios'

let companyListRequestToken = ''
let storeListRequestToken = ''

export const MenuBar = ({ toggleSidebar, theme }) => {
  return (
    <IconButton sx={{ color: theme.text.secondary }} onClick={() => toggleSidebar()}>
      <MenuRoundedIcon />
    </IconButton>
  )
}

const Navbar = ({ children }) => {
  const [navbar, setNavbar] = useState(false)
  const { user, companyId, storeId, setTenantScope } = useAuth()
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
  const [companies, setCompanies] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [loadingCompanies, setLoadingCompanies] = useState(false)
  const [loadingStores, setLoadingStores] = useState(false)
  const activeCompanyId = companyId || localStorage.getItem('x-company-id') || ''
  const activeStoreId = storeId || localStorage.getItem('x-store-id') || ''

  const normalizeList = (payload: any): any[] => {
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload?.data)) return payload.data
    if (Array.isArray(payload?.companies)) return payload.companies
    if (Array.isArray(payload?.stores)) return payload.stores
    if (Array.isArray(payload?.list)) return payload.list
    if (Array.isArray(payload?.items)) return payload.items
    return []
  }

  const userData = user as any

  const profileCompanies = useMemo(() => {
    const companiesFromUser = userData?.companies ?? []
    const singleCompany = userData?.company
    return normalizeList(companiesFromUser.length > 0 ? companiesFromUser : (singleCompany ? [singleCompany] : []))
  }, [userData?.companies, userData?.company])

  const profileStores = useMemo(() => {
    const storesFromUser = userData?.stores ?? []
    const singleStore = userData?.store
    return normalizeList(storesFromUser.length > 0 ? storesFromUser : (singleStore ? [singleStore] : []))
  }, [userData?.stores, userData?.store])

  const companyOptions = companies.length > 0 ? companies : profileCompanies
  const storeOptions = stores.length > 0 ? stores : profileStores

  const shake = keyframes`
    0% { transform: rotate(0deg); }
    10% { transform: rotate(-15deg); }
    30% { transform: rotate(10deg); }
    50% { transform: rotate(-10deg); }
    70% { transform: rotate(6deg); }
    100% { transform: rotate(0deg); }
  `

  const openNavbar = () => {
    setNavbar(true)
  }

  const handleClickNotification = (data: any) => {
    setAnchorEl(null)
    if (data.type === 'stock') return navigate(`/sale/stock/item/${data.product?._id}`)
  }

  const handleCompanyChange = (event) => {
    const nextCompanyId = event.target.value
    setTenantScope({ companyId: nextCompanyId, storeId: undefined })
    window.location.reload()
  }

  const handleStoreChange = (event) => {
    const nextStoreId = event.target.value
    setTenantScope({ companyId: activeCompanyId, storeId: nextStoreId })
    window.location.reload()
  }

  const closeNavbar = (event) => {
    !navRef.current.contains(event.target) && setNavbar(false)
  }

  useEffect(() => {
    setNavbar(false)
  }, [location])

  useEffect(() => {
    if (!user?.id) return

    const requestKey = `company:${user.id}`
    if (companyListRequestToken === requestKey) return

    companyListRequestToken = requestKey
    let isMounted = true

    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true)

        const fallbackList = profileCompanies
        if (fallbackList.length > 0) {
          if (!isMounted) return
          setCompanies(fallbackList)
          if (!activeCompanyId) {
            const fallbackCompanyId = fallbackList[0]?._id || fallbackList[0]?.id
            if (fallbackCompanyId) setTenantScope({ companyId: fallbackCompanyId })
          }
          return
        }

        const response = await Axios({ method: 'GET', url: '/organize/company/list' })
        const list = normalizeList(response?.data)

        if (!isMounted) return
        setCompanies(list)

        if (!activeCompanyId && list.length > 0) {
          const fallbackCompanyId = list[0]?._id || list[0]?.id
          if (fallbackCompanyId) {
            setTenantScope({ companyId: fallbackCompanyId })
          }
        }
      } catch (err) {
        if (isMounted) setCompanies([])
      } finally {
        if (isMounted) setLoadingCompanies(false)
      }
    }

    fetchCompanies()
    return () => { isMounted = false }
  }, [user?.id, activeCompanyId, profileCompanies, setTenantScope])

  useEffect(() => {
    if (!activeCompanyId) {
      const fallbackStores = profileStores
      setStores(fallbackStores)
      return
    }

    const requestKey = `store:${activeCompanyId}`
    if (storeListRequestToken === requestKey) return

    storeListRequestToken = requestKey
    let isMounted = true

    const fetchStores = async () => {
      try {
        setLoadingStores(true)

        const fallbackList = profileStores
        if (fallbackList.length > 0) {
          if (!isMounted) return
          setStores(fallbackList)
          if (!activeStoreId) {
            const fallbackStoreId = fallbackList[0]?._id || fallbackList[0]?.id
            if (fallbackStoreId) setTenantScope({ companyId: activeCompanyId, storeId: fallbackStoreId })
          }
          return
        }

        const response = await Axios({ method: 'GET', url: `/organize/company/detail/${activeCompanyId}` })
        const detail = response?.data?.data || response?.data || {}
        const list = normalizeList(detail?.stores || detail)

        if (!isMounted) return
        setStores(list)

        if (!activeStoreId && list.length > 0) {
          const fallbackStoreId = list[0]?._id || list[0]?.id
          if (fallbackStoreId) {
            setTenantScope({ companyId: activeCompanyId, storeId: fallbackStoreId })
          }
        }
      } catch (err) {
        if (isMounted) setStores([])
      } finally {
        if (isMounted) setLoadingStores(false)
      }
    }

    fetchStores()
    return () => { isMounted = false }
  }, [activeCompanyId, activeStoreId, profileStores, setTenantScope])

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
      playBellSound()
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
        <Stack direction={'row'} gap={1.5} alignItems={'center'}>
          <Stack direction={'row'} gap={1} alignItems={'center'} sx={{ minWidth: width > 1280 ? 360 : 280 }}>
            <FormControl size='small' sx={{ minWidth: width > 1280 ? 160 : 120 }}>
              <Select
                value={activeCompanyId || ''}
                onChange={handleCompanyChange}
                displayEmpty
                disabled={loadingCompanies || companyOptions.length === 0}
                sx={{
                  color: theme.text.primary,
                  backgroundColor: theme.background.secondary,
                  borderRadius: theme.radius.primary,
                  fontSize: 13,
                }}
              >
                {companyOptions.map((company: any) => (
                  <MenuItem key={company?._id || company?.id} value={company?._id || company?.id}>
                    {company?.name?.English || company?.name || company?.legalName || 'Company'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size='small' sx={{ minWidth: width > 1280 ? 160 : 120 }}>
              <Select
                value={activeStoreId || ''}
                onChange={handleStoreChange}
                displayEmpty
                disabled={loadingStores || storeOptions.length === 0}
                sx={{
                  color: theme.text.primary,
                  backgroundColor: theme.background.secondary,
                  borderRadius: theme.radius.primary,
                  fontSize: 13,
                }}
              >
                {storeOptions.map((store: any) => (
                  <MenuItem key={store?._id || store?.id} value={store?._id || store?.id}>
                    {store?.name?.English || store?.name || 'Store'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
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
                zIndex: 1000
              }}
            >
            </Badge>
            <NotificationsRoundedIcon sx={{ animation: bumped ? `${shake} 0.8s ease` : 'none', transformOrigin: 'top center' }} />
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
