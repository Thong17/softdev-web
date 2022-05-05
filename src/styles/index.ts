import { styled } from '@mui/system'
import { Stack } from '@mui/material'
import { IThemeMode } from 'contexts/theme/interface'

export const CustomSideNav = styled(Stack)(
  ({ styled, isOpen }: { styled: IThemeMode, isOpen: boolean }) => ({
    height: 'calc(100vh - 16px)',
    backgroundColor: styled.background.secondary,
    borderRadius: 10,
    margin: 8,
    boxShadow: styled.shadow.container,
    position: 'fixed',
    transition: '0.3s ease',
    '&:hover': {
      width: '250px !important'
    },
    '&:hover a span': {
      display: 'block'
    },
    '& a span': {
      display: isOpen ? 'block' : 'none'
    },
    '& a': {
      transition: '0.3s ease',
      color: styled.text.primary,
      borderRadius: styled.radius,
      marginLeft: 11,
      width: 'calc(100% - 22px)',
      padding: '9px 0',
      display: 'flex',
      alignItem: 'center',      
    },
    '& a:hover': {
      backgroundColor: styled.active.secondary,     
    },
    '& a.active': {
      boxShadow: styled.shadow.container,
      backgroundColor: styled.active.primary,
    },
    '& a svg': {
      marginLeft: 12
    },
  })
)

export const CustomNavbar = styled(Stack)(
  ({ styled }: { styled: IThemeMode }) => ({
    '& a.active': {
      backgroundColor: styled.active.primary,
    },
    '& a': {
      color: styled.text.primary,
    },
    backgroundColor: styled.background.primary,
    height: 70,
    padding: '0 50px'
  })
)

export const CustomFooter = styled(Stack)(
  ({ styled }: { styled: IThemeMode }) => ({
    width: '100%',
    backgroundColor: styled.background.primary,
    height: 50,
  })
)
