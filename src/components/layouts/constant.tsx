import SettingsIcon from '@mui/icons-material/Settings'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded'

export const sideNav = [
  {
    route: '/',
    title: 'HOME',
    icon: <HomeRoundedIcon />,
  },
  {
    route: '/sale',
    title: 'SALE',
    icon: <AttachMoneyRoundedIcon />,
  },
  {
    route: '/store',
    title: 'STORE',
    icon: <StorefrontRoundedIcon />,
  },
  {
    route: '/admin',
    title: 'ADMIN',
    icon: <AdminPanelSettingsIcon />,
  },
  {
    route: '/report',
    title: 'REPORT',
    icon: <BarChartRoundedIcon />,
  },
  {
    route: '/config',
    title: 'CONFIG',
    icon: <SettingsIcon />,
  },
]
