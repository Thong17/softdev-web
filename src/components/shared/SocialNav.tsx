import React from 'react'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import useTheme from 'hooks/useTheme'

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
        boxShadow: theme.shadow.secondary
      }}
    >
      <FacebookIcon />
      <YouTubeIcon />
      <InstagramIcon />
    </div>
  )
}
