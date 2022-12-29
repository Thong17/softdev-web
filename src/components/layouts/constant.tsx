import SettingsIcon from '@mui/icons-material/Settings'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import PriceChangeRoundedIcon from '@mui/icons-material/PriceChangeRounded'
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded'

export const sideNav: any = [
  {
    route: '/home',
    title: 'HOME',
    icon: <HomeRoundedIcon />,
  },
  {
    route: '/function',
    title: 'FUNCTION',
    icon: <ConfirmationNumberRoundedIcon />,
    permission: 'function',
    children: [
      {
        route: '/function/queue',
        title: 'QUEUE',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'queue'
      },
    ]
  },
  {
    route: '/sale',
    title: 'OPERATION',
    icon: <PriceChangeRoundedIcon />,
    permission: 'operation',
    children: [
      {
        route: '/sale/stock',
        title: 'STOCK',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'stock'
      },
      {
        route: '/sale/cashing',
        title: 'CASHING',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'cashing'
      },
      {
        route: '/sale/reservation',
        title: 'RESERVATION',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'reservation'
      },
    ]
  },
  {
    route: '/organize',
    title: 'ORGANIZE',
    icon: <StorefrontRoundedIcon />,
    permission: 'organize',
    children: [
      {
        route: '/organize/brand',
        title: 'BRAND',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'brand'
      },
      {
        route: '/organize/category',
        title: 'CATEGORY',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'category'
      },
      {
        route: '/organize/product',
        title: 'PRODUCT',
        icon: <ArrowRightAltRoundedIcon />,
        permission: 'product'
      },
    ]
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
    permission: 'config'
  },
]
