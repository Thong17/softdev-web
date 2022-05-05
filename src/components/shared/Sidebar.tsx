import { NavLink } from 'react-router-dom'
import { sideNav } from '../layouts/constant'
import useTheme from 'hooks/useTheme'
import { CustomSideNav } from 'styles'
import useConfig from 'hooks/useConfig'

const Sidebar = () => {
  const { theme } = useTheme()
  const { sidebar, toggleSidebar } = useConfig()

  return (
    <CustomSideNav
      direction='column'
      justifyContent='space-around'
      alignItems='start'
      className='side-nav'
      style={{ width: sidebar ? 250 : 70 }}
      styled={theme}
      isOpen={sidebar}
    >
      <button onClick={() => toggleSidebar()}>Toggle</button>
      {sideNav.map((nav, index) => (
        <NavLink key={index} to={nav.route}>
          {nav.icon}
          <span>{nav.title}</span>
        </NavLink>
      ))}
    </CustomSideNav>
  )
}

export default Sidebar
