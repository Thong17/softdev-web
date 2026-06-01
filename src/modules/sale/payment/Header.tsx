import { CustomButton } from 'styles/index'
import Breadcrumbs from '../components/Breadcrumbs'
import { Box } from '@mui/material'
import useTheme from 'hooks/useTheme'
import useLanguage from 'hooks/useLanguage'

const RequestNotification = ({ qty }) => {
  const { theme } = useTheme()
  return (
    <Box
      component='span'
      sx={{ backgroundColor: theme.color.error, color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'grid', placeItems: 'center', position: 'absolute', top: '-10px', right: '-10px' }}
    >
      {qty}
    </Box>
  )
}

export const Header = ({ styled, onOpenGroupPayment, listPaymentSelected, privilege }) => {
  const { language } = useLanguage()
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <Breadcrumbs page='payment' />
      {privilege?.payment?.merge && <CustomButton
        onClick={() => onOpenGroupPayment()}
        style={{
          marginLeft: 10,
          backgroundColor: `${styled.color.info}22`,
          color: styled.color.info,
        }}
        styled={styled}
      >
        {listPaymentSelected.length > 0 && <RequestNotification qty={listPaymentSelected.length} />}
        {language['GROUP_PAYMENT']}
      </CustomButton>}
    </Box>
  )
}
