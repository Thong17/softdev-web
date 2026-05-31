import Breadcrumbs from '../components/Breadcrumbs'
import { Box } from '@mui/material'

export const Header = () => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <Breadcrumbs page='payment' />
    </Box>
  )
}
