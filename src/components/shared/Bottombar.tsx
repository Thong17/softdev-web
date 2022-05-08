import { NavLink } from 'react-router-dom'
import { sideNav } from '../layouts/constant'
import useTheme from 'hooks/useTheme'
import { CustomBottomNav } from 'styles'
import useLanguage from 'hooks/useLanguage'

const Bottombar = () => {
  const { theme } = useTheme()
  const { language } = useLanguage()

  return (
      <CustomBottomNav
        styled={theme}
      >
        {sideNav.map((nav, index) => (
          <NavLink key={index} to={nav.route}>
            {nav.icon}
            <span>{language[nav.title] || nav.title}</span>
          </NavLink>
        ))}
      </CustomBottomNav>
  )
}

export default Bottombar
