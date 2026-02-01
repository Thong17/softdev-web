import { NavLink } from 'react-router-dom'
import { sideNav } from '../layouts/constant'
import useTheme from 'hooks/useTheme'
import { CustomBottomNav } from 'styles'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'
import { Box } from '@mui/material'

const Bottombar = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()

  return (
    <CustomBottomNav styled={theme}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: theme.background.secondary,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderRadius: theme.radius.ternary
        }}
      >
        {sideNav.map((nav, index) => {
          const permission = nav.permission
            ? user?.privilege?.menu?.[nav.permission]
            : true
          if (permission) {
            return (
              <NavLink key={index} to={nav.route}>
                {nav.icon}
                <span>{language?.[nav.title] || nav.title}</span>
              </NavLink>
            )
          } else {
            return <span key={index} style={{ display: 'none' }}></span>
          }
        })}
      </Box>
    </CustomBottomNav>
  )
}

export default Bottombar
