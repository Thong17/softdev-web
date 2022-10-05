import SettingsIcon from '@mui/icons-material/Settings'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'

export const sideNav = [
  {
    route: '/home',
    title: 'HOME',
    icon: <HomeRoundedIcon />,
  },
  {
    route: '/sale',
    title: 'SALE',
    icon: <PriceChangeRoundedIcon />,
    permission: 'operation'
  },
  {
    route: '/organize',
    title: 'ORGANIZE',
    icon: <StorefrontRoundedIcon />,
    permission: 'organize'
  },
  {
    route: '/admin',
    title: 'ADMIN',
    icon: <AdminPanelSettingsIcon />,
    permission: 'admin'
  },
  {
    route: '/report',
    title: 'REPORT',
    icon: <BarChartRoundedIcon />,
    permission: 'report'
  },
  {
    route: '/config',
    title: 'CONFIG',
    icon: <SettingsIcon />,
  },
]
