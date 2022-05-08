import { styled } from '@mui/system'
import { Button, Select, Stack } from '@mui/material'
import { IThemeMode, IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'

export const CustomSideNav = styled(Stack)(
  ({ styled }: { styled: IThemeStyle }) => ({
    height: '100%',
    width: '100%',
    backgroundColor: styled.background.secondary,
    boxShadow: styled.shadow.container,
    borderRadius: styled.radius.primary,
    '& a': {
      color: styled.text.primary,
      borderRadius: styled.radius.primary,
      marginLeft: 11,
      width: 'calc(100% - 22px)',
      padding: '9px 0',
      display: 'flex',
      alignItem: 'center',
    },
    '& a:hover': {
      boxShadow: styled.shadow.container,
      backgroundColor: styled.active.secondary,
    },
    '& a.active': {
      boxShadow: styled.shadow.container,
      backgroundColor: styled.active.primary,
    },
    '& a svg': {
      marginLeft: 12,
    },
  })
)

export const SideNavContainer = styled('div')(
  ({ open, device }: { open: boolean, device: DeviceOptions }) => ({
    position: 'fixed',
    height: 'calc(100vh - 16px)',
    width: open ? 250 : 70,
    transition: '0.3s ease',
    padding: 8,
    '& div a': {
      textDecoration: 'none !important',
    },
    '& div a span': {
      transition: open ? '0.3s 0.1s ease' : '0',
      opacity: open ? '1' : '0',
      overflow: !open && 'hidden',
      alignSelf: 'center',
      marginLeft: 10,
      lineHeight: 0,
    },
    '& div a:hover': {
      transition: '0.3s ease',
      width: !open && 'max-content !important',
      paddingRight: !open && 15,
    },
    '& div a:hover span': {
      transition: '0.3s ease',
      opacity: '1',
      overflow: 'visible',
    },
  })
)

export const CustomNavbar = styled(Stack)(
  ({ styled }: { styled: IThemeStyle }) => ({
    '& a.active': {
      backgroundColor: styled.active.primary,
    },
    '& a': {
      color: styled.text.primary,
    },
    backgroundColor: styled.background.primary,
    height: 70,
    padding: '0 50px',
  })
)

export const CustomFooter = styled(Stack)(
  ({ styled }: { styled: IThemeMode }) => ({
    width: '100%',
    backgroundColor: styled.background.primary,
    color: styled.text.primary,
    height: 50,
  })
)

export const CustomSelect = styled(Select)(
  ({ styled }: { styled: IThemeMode }) => ({
    textTransform: 'capitalize',
    backgroundColor: styled.background.secondary,
    color: styled.text.primary,
    border: styled.border.secondary,
  })
)

export const CustomProfile = styled(Button)(
  ({ styled }: { styled: IThemeStyle }) => ({
    backgroundColor: styled.background.primary,
    color: styled.text.primary,
    display: 'flex',
    padding: '5px 13px 5px 5px',
    borderRadius: styled.radius.rounded,
    border: styled.border.secondary,
    alignItems: 'center',
    textTransform: 'none',
    '& img,div': {
      zIndex: 100,
      backgroundColor: styled.background.secondary,
      width: 30,
      height: 30,
      marginRight: 8,
      borderRadius: styled.radius.circle,
      boxShadow: styled.shadow.secondary,
    },
    '& div': {
      display: 'flex',
      justifyContent: 'center',
      textTransform: 'capitalize',
    },
  })
)

export const CustomLoading = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    width: '100vw',
    height: '100vh',
    backgroundColor: styled.background.primary,
    position: 'fixed',
  })
)

export const CustomMenubar = styled('div')(
  ({ styled, open }: { styled: IThemeStyle; open: boolean }) => ({
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    border: styled.border.secondary,
    borderRadius: styled.radius.primary,
    cursor: 'pointer',
    '& div': {
      backgroundColor: styled.text.primary,
      height: '1px !important',
      width: '50%',
      borderRadius: '1px'
    },
    '&:hover': {
      border: styled.border.primary,
    },
    '& div:nth-of-type(2)': {
      width: open && '30% !important',
    },
  })
)

export const ListNavbar = styled('div')({
  width: '50%',
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  '& a': {
    textDecoration: 'none',
  },
})
