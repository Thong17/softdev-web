import { NavLink } from 'react-router-dom'
import { sideNav } from '../layouts/constant'
import useTheme from 'hooks/useTheme'
import { CustomSideNav, SideNavContainer } from 'styles'
import useConfig from 'hooks/useConfig'
import useLanguage from 'hooks/useLanguage'

const Sidebar = () => {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { sidebar } = useConfig()

  return (
    <SideNavContainer open={sidebar}>
      <CustomSideNav
        direction='column'
        justifyContent='space-around'
        alignItems='start'
        className='side-nav'
        styled={theme}
      >
        {sideNav.map((nav, index) => (
          <NavLink key={index} to={nav.route}>
            {nav.icon}
            <span>{language[nav.title] || nav.title}</span>
          </NavLink>
        ))}
      </CustomSideNav>
    </SideNavContainer>
  )
}

export default Sidebar
