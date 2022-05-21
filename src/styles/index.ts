import { styled } from '@mui/system'
import { Button, Stack } from '@mui/material'
import { IThemeMode, IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'
import { NAVBAR_HEIGHT, INPUT_HEIGHT } from './constant'

export const CustomBottomNav = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    width: '100%',
    height: NAVBAR_HEIGHT - 20,
    backgroundColor: styled.background.primary,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    boxShadow: styled.shadow.primary,
    zIndex: 1000,
    '& a': {
      position: 'relative',
      padding: 5,
      borderRadius: styled.radius.primary,
      color: styled.text.primary,
      transition: '0.3s ease',
      display: 'flex',
      alignItem: 'center',
    },
    '& a:hover span': {
      display: 'block',
      position: 'absolute',
      width: 'max-content',
      backgroundColor: styled.active.primary,
      top: -45,
      left: '50%',
      transform: 'translate(-50%, 0)',
      padding: '10px 20px',
      boxShadow: styled.shadow.container,
      borderRadius: styled.radius.secondary,
    },
    '& a.active, a:hover': {
      boxShadow: styled.shadow.container,
      backgroundColor: styled.active.primary,
    },
    '& a span': {
      display: 'none',
      lineHeight: 0,
      height: 17,
      alignSelf: 'center',
    },
  })
)

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
  ({ open }: { open: boolean }) => ({
    position: 'fixed',
    height: 'calc(100vh - 16px)',
    width: open ? 250 : 70,
    transition: '0.3s ease',
    zIndex: 1001,
    padding: '8px 0 8px 8px',
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

export const CustomFooter = styled(Stack)(
  ({ styled }: { styled: IThemeMode }) => ({
    width: '100%',
    backgroundColor: styled.background.primary,
    color: styled.text.primary,
    height: 70,
  })
)

export const CustomProfile = styled(Button)(
  ({ styled }: { styled: IThemeStyle }) => ({
    backgroundColor: styled.background.primary,
    color: styled.text.primary,
    display: 'flex',
    padding: '5px 13px 5px 5px',
    borderRadius: styled.radius.rounded,
    border: styled.border.tertiary,
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
    border: styled.border.tertiary,
    borderRadius: styled.radius.primary,
    cursor: 'pointer',
    '& div': {
      backgroundColor: styled.text.primary,
      height: '1px !important',
      width: '50%',
      borderRadius: '1px',
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

export const CustomNavbar = styled(Stack)(
  ({
    styled,
    device,
    sidebar,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    sidebar: number
  }) => ({
    '&.active': {
      transform: 'translateY(-100%)',
    },
    '&.scrolling': {
      boxShadow: 'none',
    },
    '& a.active': {
      backgroundColor: styled.active.secondary,
    },
    '& a': {
      color: styled.text.primary,
    },
    transition: '0.3s ease',
    position: 'fixed',
    left: sidebar,
    right: 0,
    zIndex: 1000,
    backgroundColor: styled.background.primary,
    height: NAVBAR_HEIGHT,
    padding: device === 'mobile' ? '0 20px' : '0 50px',
  })
)

export const RowNavbar = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'center',
  overflow: 'scroll',
  height: '90%',
})

export const NavbarContainer = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100vw',
    overflow: 'hidden',
    top: NAVBAR_HEIGHT,
    left: 0,
    backgroundColor: styled.background.primary,
    boxShadow: styled.shadow.bottom,
    position: 'fixed',
    transition: '0.3s ease',
    '& div a': {
      textDecoration: 'none',
      width: '100%',
      padding: '13px 0',
      textAlign: 'center',
    },
    '& div a:hover': {
      backgroundColor: styled.active.secondary,
    },
  })
)

export const Breadcrumbs = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    width: 'fit-content',
    display: 'flex',
    alignItems: 'center',
    '& *': {
      margin: 0,
    },
    '& div': {
      display: 'flex',
    },
    '& div a:nth-of-type(n+2)': {
      position: 'relative',
    },
    '& div a:nth-of-type(n+2)::before': {
      content: '""',
      position: 'absolute',
      left: -6,
      bottom: 5,
      color: styled.text.secondary,
      width: 7,
      height: 7,
      borderTop: styled.border.primary,
      borderRight: styled.border.primary,
      transform: 'rotate(45deg)',
    },
    '& div a': {
      textDecoration: 'none',
      color: styled.text.primary,
      padding: '0px 20px',
    },
    '& span': {
      paddingRight: 20,
      borderRight: styled.border.primary,
    },
  })
)

export const CustomInput = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    position: 'relative',
    padding: '30px 0 20px 0',
    overflow: 'hidden',
    '& input': {
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      color: styled.text.primary,
      width: '100%',
      border: styled.border.tertiary,
      height: INPUT_HEIGHT,
      borderRadius: styled.radius.primary,
      padding: '0 13px',
      outline: 'none !important',
      boxShadow: 'none',
      transition: '0.3s ease',
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `${styled.responsive[device].text.primary} !important`,
      '&:hover, &:focus': {
        border: styled.border.secondary,
      },
      '&:focus ~ label, &:not(:placeholder-shown) ~ label': {
        transform: 'translate(-8px, -24px)',
        width: 'max-content',
        backgroundColor: 'inherit',
        fontSize: styled.responsive[device].text.quaternary,
        color: styled.text.tertiary,
      },
      '&[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button':
        {
          appearance: 'none',
        },
    },
    '& input.input-error': {
      borderColor: styled.color.error,
      '& ~ .err, & ~ label': {
        color: styled.color.error
      }
    },
    '& label': {
      transition: '0.2s ease',
      position: 'absolute',
      cursor: 'text',
      top: '39px',
      left: '14px',
      fontSize: styled.responsive[device]?.text.primary,
      color: styled.text.quaternary,
      userSelect: 'none'
    },
    '& .hint': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.color.info,
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      right: '6px',
      userSelect: 'none'
    },
    '& .err': {
      position: 'absolute',
      left: 7,
      fontSize: styled.responsive[device]?.text.quaternary,
    }
  })
)

export const CustomUpload = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    padding: '30px 0 20px 0',
    position: 'relative',
    minWidth: 130,
    '& .label': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.text.tertiary,
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      left: '6px',
      userSelect: 'none'
    },
    '& .hint': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.color.info,
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      right: '6px',
      userSelect: 'none'
    },
    '& label': {
      color: styled.text.tertiary,
      backgroundColor: 'transparent',
      width: 'calc(100% - 28px)',
      display: 'flex',
      justifyContent: 'center',
      alignItem: 'center',
      borderRadius: styled.radius.primary,
      border: styled.border.tertiary,
      borderStyle: 'dashed !important',
      padding: '0 13px',
      cursor: 'pointer',
    },
    '& label.input-error': {
      borderColor: styled.color.error,
      '& ~ .err, & ~ .label': {
        color: styled.color.error
      }
    },
    '& label span': {
      alignSelf: 'center',
    },
    '& input': {
      display: 'none',
    },
    '& .err': {
      position: 'absolute',
      left: 7,
      fontSize: styled.responsive[device]?.text.quaternary,
    }
  })
)

export const CustomSelect = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    minWidth: 130,
    padding: '30px 0 20px 0',
    position: 'relative',
    '& label': {
      transition: '0.2s ease',
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      left: '6px',
      fontSize: styled.responsive[device]?.text.quaternary,
      color: styled.text.tertiary,
      userSelect: 'none'
    },
    '& .MuiSelect-select, & .MuiList-root li': {
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `${styled.responsive[device].text.primary} !important`,
    },
    '& div': {
      textTransform: 'capitalize',
      color: styled.text.primary,
      width: '100%',
      padding: 0,
      '& div': {
        minHeight: '35px !important',
        padding: '0 13px',
        display: 'flex',
        alignItems: 'center',
        border: styled.border.tertiary
      },
      '& div:hover, & div:focus': {
        border: styled.border.secondary,
      },
      '& fieldset': {
        border: 'none',
      },
      '& svg': {
        color: styled.text.quaternary,
      },
    },
    '& div.input-error': {
      '& div': {
        borderColor: styled.color.error
      },
      '& ~ label, & ~ .err': {
        color: styled.color.error
      }
    },
    '& .err': {
      position: 'absolute',
      left: 7,
      fontSize: styled.responsive[device]?.text.quaternary,
    },
    '& .hint': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.color.info,
      width: 'fit-content',
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      right: '6px',
      userSelect: 'none'
    },
  })
)
