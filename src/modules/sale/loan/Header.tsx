import Breadcrumbs from '../components/Breadcrumbs'
import { Box } from '@mui/material'
import { CustomButton } from 'styles/index'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListRequestLoan, selectListRequestLoan } from './redux'

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

export const Header = ({ styled, onOpenRequest }) => {
  const { language } = useLanguage()
  const { data } = useAppSelector(selectListRequestLoan)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getListRequestLoan({}))
  }, [dispatch])
  
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <Breadcrumbs page='loan' />
      <CustomButton
        onClick={() => onOpenRequest()}
        style={{
          marginLeft: 10,
          backgroundColor: styled.background.secondary,
          color: styled.text.secondary,
        }}
        styled={styled}
      >
        {data.length > 0 && <RequestNotification qty={data.length} />}
        {language['REQUEST']}
      </CustomButton>
    </Box>
  )
}
