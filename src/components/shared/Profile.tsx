import { Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { FC, useState } from 'react'
import { CustomProfile } from 'styles'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { useNavigate } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'

interface IProfile {
  id: string
  username: string
  picture?: string
}

const localeLabel = (value: any) => (typeof value === 'string' ? value : value?.English)

const Profile: FC<IProfile> = ({ id, username, picture }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const { logout, user, switchStore } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const stores = user?.stores || []

  const handleSwitchStore = async (storeId: string) => {
    setAnchorEl(null)
    if (storeId === user?.activeStoreId) return
    await switchStore(storeId)
    navigate('/', { replace: true })
  }

  return (
    <>
      {username && (
        <CustomProfile
          styled={theme}
          aria-controls='profile-menu'
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          {picture ? (
            <img
              src={`${process.env.REACT_APP_API_UPLOADS}${picture}`}
              alt={username}
              loading='lazy'
            />
          ) : (
            <div style={{ alignItems: 'center' }}>{username[0]}</div>
          )}
          {username}
        </CustomProfile>
      )}
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        id='profile-menu'
        style={{
          marginTop: 10,
        }}
      >
        <MenuItem onClick={() => navigate(`/user/${id}`)}>
          <PersonRoundedIcon style={{ marginRight: 10 }} /> {language['PROFILE']}
        </MenuItem>
        <MenuItem onClick={() => navigate(`/change-password/${id}`)}>
          <VpnKeyRoundedIcon style={{ marginRight: 10 }} /> {language['CHANGE_PASSWORD']}
        </MenuItem>
        {stores.length > 1 && <Divider />}
        {stores.length > 1 && (
          <MenuItem disabled style={{ opacity: 1 }}>
            <Typography style={{ fontSize: 12, color: theme.text.quaternary }}>
              {language['STORE'] || 'Store'}
            </Typography>
          </MenuItem>
        )}
        {stores.length > 1 && stores.map((store) => (
          <MenuItem key={store.id} onClick={() => handleSwitchStore(store.id)}>
            <ListItemIcon>
              <StorefrontRoundedIcon fontSize='small' />
            </ListItemIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography noWrap style={{ fontSize: 14 }}>{store.name}</Typography>
              {store.roleName && (
                <Typography noWrap style={{ fontSize: 11, color: theme.text.quaternary }}>
                  {localeLabel(store.roleName)}
                </Typography>
              )}
            </div>
            {store.id === user?.activeStoreId && (
              <CheckRoundedIcon fontSize='small' style={{ marginLeft: 10, color: theme.color.success }} />
            )}
          </MenuItem>
        ))}
        {stores.length > 1 && <Divider />}
        <MenuItem onClick={() => logout()}>
          <LogoutRoundedIcon style={{ marginRight: 10 }} /> {language['LOGOUT']}
        </MenuItem>
      </Menu>
    </>
  )
}

export default Profile
