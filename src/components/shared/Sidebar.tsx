import { NavLink } from 'react-router-dom'
import { sideNav } from '../layouts/constant'
import useTheme from 'hooks/useTheme'
import { CustomSideNav, SideNavContainer } from 'styles'
import useConfig from 'hooks/useConfig'
import useLanguage from 'hooks/useLanguage'
import useAuth from 'hooks/useAuth'

const Sidebar = () => {
  const { user } = useAuth()
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
        {sideNav.map((nav, index) => {
          const permission = nav.permission ? user?.privilege.menu[nav.permission] : true
          if (permission) {
            return <NavLink key={index} to={nav.route}>
              {nav.icon}
              <span>{language?.[nav.title] || nav.title}</span>
            </NavLink>
          } else {
            return <span key={index} style={{ display: 'none' }}></span>
          }
        })}
      </CustomSideNav>
    </SideNavContainer>
  )
}

export default Sidebar
