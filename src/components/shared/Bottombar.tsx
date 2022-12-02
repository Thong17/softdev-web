import { NavLink } from 'react-router-dom'
import { sideNav } from '../layouts/constant'
import useTheme from 'hooks/useTheme'
import { CustomBottomNav } from 'styles'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'

const Bottombar = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { language } = useLanguage()

  return (
      <CustomBottomNav
        styled={theme}
      >
        {sideNav.map((nav, index) => {
          const permission = nav.permission ? user?.privilege?.menu?.[nav.permission] : true
          if (permission) {
            return <NavLink key={index} to={nav.route}>
              {nav.icon}
              <span>{language?.[nav.title] || nav.title}</span>
            </NavLink>
          } else {
            return <span key={index} style={{ display: 'none' }}></span>
          }
        })}
      </CustomBottomNav>
  )
}

export default Bottombar
