import React from 'react'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import useTheme from 'hooks/useTheme'
import { styled } from '@mui/system'
import { IThemeStyle } from 'contexts/theme/interface'

const NavItem = styled('a')(
  ({ styled }: { styled: IThemeStyle }) => ({
    color: styled.text.secondary
  })
)

export const SocialNav = () => {
  const { theme } = useTheme()
  return (
    <div
      style={{
        backgroundColor: theme.background.secondary,
        position: 'fixed',
        right: 10,
        top: '50%',
        height: 130,
        transform: 'translate(0, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 15px',
        borderRadius: theme.radius.ternary,
        boxShadow: theme.shadow.secondary,
        zIndex: 1000
      }}
    >
      <NavItem styled={theme} href={process.env.REACT_APP_FACEBOOK_PAGE_URL} target='_blank'>
        <FacebookIcon />
      </NavItem>
      <NavItem styled={theme} href={process.env.REACT_APP_YOUTUBE_CHANNEL_URL} target='_blank'>
        <YouTubeIcon />
      </NavItem>
      <NavItem styled={theme} href={process.env.REACT_APP_INSTAGRAM_ACCOUNT_URL} target='_blank'>
        <InstagramIcon />
      </NavItem>
    </div>
  )
}
