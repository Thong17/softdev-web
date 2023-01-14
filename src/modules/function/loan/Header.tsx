import Breadcrumbs from '../components/Breadcrumbs'
import { Box } from '@mui/material'
import { CustomButton } from 'styles/index'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'

const RequestNotification = ({ qty }) => {
  const { theme } = useTheme()
  return (
    <Box
      component='span'
      sx={{ backgroundColor: theme.color.error, width: '24px', height: '24px', borderRadius: '50%', display: 'grid', placeItems: 'center', position: 'absolute', top: '-10px', right: '-10px' }}
    >
      {qty}
    </Box>
  )
}

export const Header = ({ styled }) => {
  const { language } = useLanguage()
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <Breadcrumbs page='loan' />
      <CustomButton
        style={{
          marginLeft: 10,
          backgroundColor: styled.background.secondary,
          color: styled.text.secondary,
        }}
        styled={styled}
      >
        <RequestNotification qty={9} />
        {language['REQUEST']}
      </CustomButton>
    </Box>
  )
}
