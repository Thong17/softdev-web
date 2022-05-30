import { Menu, MenuList } from '@mui/material'
import useAuth from 'hooks/useAuth'
import useTheme from 'hooks/useTheme'
import { FC, useState } from 'react'
import { CustomProfile } from 'styles'

interface IProfile {
  username: string,
  picture?: string
}

const Profile: FC<IProfile> = ({ username, picture }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const { logout } = useAuth()
  const { theme } = useTheme()

  return (
    <>
      <CustomProfile
        styled={theme}
        aria-controls='profile-menu'
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {
          picture 
            ? (<img src={picture} alt={username} />) 
            : (<div style={{ alignItems: 'center' }}>{username[0]}</div>)
        }
        {username}
      </CustomProfile>
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        id='profile-menu'
        style={{
          marginTop: 10
        }}
      >
        <MenuList onClick={() => logout()}>Logout</MenuList>
      </Menu>
    </>
  )
}

export default Profile
