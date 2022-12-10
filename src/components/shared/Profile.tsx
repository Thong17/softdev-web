import { Menu, MenuItem } from '@mui/material'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { FC, useState } from 'react'
import { CustomProfile } from 'styles'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'
import { useNavigate } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'

interface IProfile {
  id: string
  username: string
  picture?: string
}

const Profile: FC<IProfile> = ({ id, username, picture }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const { logout } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()
  const navigate = useNavigate()

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
        <MenuItem onClick={() => logout()}>
          <LogoutRoundedIcon style={{ marginRight: 10 }} /> {language['LOGOUT']}
        </MenuItem>
      </Menu>
    </>
  )
}

export default Profile
