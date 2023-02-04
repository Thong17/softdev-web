import { styled } from '@mui/system'
import { Button, Menu, Stack } from '@mui/material'
import { IThemeMode, IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'
import { NAVBAR_HEIGHT } from './constant'

export const CustomBottomNav = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    width: '100%',
    height: NAVBAR_HEIGHT - 20,
    backgroundColor: styled.background.primary,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    boxShadow: styled.shadow.primary,
    paddingBottom: 20,
    zIndex: 1000,
    '& a': {
      position: 'relative',
      color: styled.text.primary,
      display: 'flex',
      alignItem: 'center',
      height: '100%',
      paddingTop: 5,
      boxSizing: 'border-box'
    },
    '& a span': {
      display: 'block',
      position: 'absolute',
      width: 'max-content',
      top: 33,
      left: '50%',
      transform: 'translate(-50%, 0)',
      fontSize: 11,
      borderRadius: styled.radius.secondary,
    },
    '& a.active': {
      color: styled.color.info,
      position: 'relative',
      '&::before': {
        content: `''`,
        backgroundColor: styled.color.info,
        position: 'absolute',
        top: 0,
        left: 0,
        height: 2,
        width: '100%',
        borderRadius: 1
      }
    },
    '& a:hover': {
      color: styled.color.info,
    }
  })
)

export const CustomSideNav = styled(Stack)(
  ({ styled }: { styled: IThemeStyle }) => ({
    height: '100%',
    width: '100%',
    paddingTop: 20,
    boxSizing: 'border-box',
    backgroundColor: styled.background.secondary,
    boxShadow: styled.shadow.secondary,
    borderRadius: styled.radius.ternary,
    '& a': {
      color: styled.text.primary,
      borderRadius: styled.radius.secondary,
      marginLeft: 11,
      width: 'calc(100% - 22px)',
      padding: '9px 0',
      display: 'flex',
      alignItem: 'center',
      marginBottom: 20
    },
    '& a:hover': {
      boxShadow: styled.shadow.container,
      backgroundColor: styled.active.secondary,
    },
    '& a.active': {
      boxShadow: styled.shadow.container,
      backgroundColor: `${styled.color.info}11`,
      color: styled.color.info,
      position: 'relative',
      '&::before': {
        content: `''`,
        backgroundColor: styled.color.info,
        position: 'absolute',
        bottom: 0,
        left: '30%',
        height: 2,
        width: '40%',
        borderRadius: 1
      }
    },
    '& a svg': {
      marginLeft: 12,
    },
    '& .link': {
      width: '100%',
    }
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
    '& div a:hover .toggle': {
      display: 'block',
    },
    '& .toggle': {
      display: open ? 'block' : 'none',
    }
  })
)

export const CustomFooter = styled(Stack)(
  ({ styled }: { styled: IThemeMode }) => ({
    width: '100%',
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
      objectFit: 'cover'
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
    width: '100%',
    height: '100%',
    backgroundColor: styled.background.primary,
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
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
      backgroundColor: `${styled.color.info}11`,
      color: styled.color.info,
      position: 'relative',
      boxShadow: styled.shadow.secondary,
      '&::before': {
        content: `''`,
        backgroundColor: styled.color.info,
        position: 'absolute',
        bottom: 0,
        left: '30%',
        height: 2,
        width: '40%',
        borderRadius: 1
      }
    },
    '& a:hover': {
      textDecoration: 'underline',
      color: styled.color.info,
    },
    '& a': {
      color: styled.text.secondary,
      padding: '7px 17px',
      borderRadius: styled.radius.secondary,
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
  overflow: 'auto',
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
      bottom: 11,
      color: styled.text.secondary,
      width: 7,
      height: 7,
      borderTop: styled.border.secondary,
      borderRight: styled.border.secondary,
      borderWidth: 2,
      transform: 'rotate(45deg)',
      borderRadius: 1
    },
    '& div a': {
      textDecoration: 'none',
      color: styled.text.primary,
      padding: '0px 20px',
      height: 30,
      display: 'flex',
      alignItems: 'center'
    },
    '& span': {
      position: 'relative',
      paddingRight: 20,
      '&::before': {
        content: `""`,
        position: 'absolute',
        right: 0,
        top: 4,
        height: '60%',
        width: 2,
        borderRadius: 1,
        backgroundColor: styled.text.quaternary

      }
    }
  })
)

export const CustomButton = styled(Button)(
  ({ styled }: { styled: IThemeStyle }) => ({
    borderRadius: styled.radius.primary,
    padding: '6px 13px',
  })
)

export const CustomPrivilege = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    border: styled.border.quaternary,
    borderRadius: styled.radius.secondary,
    position: 'relative',
    margin: '20px 0',
    '& .label': {
      position: 'absolute',
      top: -11,
      left: 20,
      padding: '0 5px',
      color: styled.text.secondary,
      backgroundColor: styled.background.primary,
    },
    '& label span.Mui-disabled.MuiFormControlLabel-label, label span.Mui-disabled':
      {
        color: styled.text.quaternary,
      },
    '& .privilege-container, & .checkAll-container': {
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      padding: '20px 20px 0 20px',
      '& label': {
        '& span': {
          fontWeight: styled.font.weight,
        },
      },
    },
    '& .privilege-container': {
      marginLeft: 20,
      padding: '0 20px 20px 20px',
      '& div': {
        marginLeft: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      },
    },
  })
)

export const CustomPagination = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'absolute',
    bottom: 0,
    right: 37,
    height: 40,
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    overflow: 'hidden',
    '& div, & div div svg': {
      color: styled.text.secondary,
    },
  })
)

export const CustomSearchField = styled('div')(
  ({
    styled,
    active,
    device,
  }: {
    styled: IThemeStyle
    active: string
    device: DeviceOptions
  }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    transition: '0.2s ease',
    padding: '1px 4px 1px 5px',
    backgroundColor: `${styled.color.info}22`,
    borderRadius: styled.radius.primary,
    height: 34,
    width: active === 'active' ? 270 : 32,
    '& input': {
      color: styled.text.secondary,
      border: 'none',
      background: 'none',
      outline: 'none !important',
      boxShadow: 'none',
      fontWeight: styled.font.weight,
      fontFamily: styled.font.family,
      fontSize: styled.responsive[device].text.primary,
      padding: '0 10px',
      width: '100%',
    },
    '& button.search-btn': {
      position: 'absolute',
      height: 36,
      width: 36,
      right: 2,
      color: styled.color.info,
    },
    '& button': {
      color: styled.text.secondary,
    },
  })
)

export const CustomMiniSearchField = styled('div')(
  ({
    styled,
    active,
    device,
  }: {
    styled: IThemeStyle
    active: string
    device: DeviceOptions
  }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    transition: '0.2s ease',
    borderRadius: styled.radius.primary,
    height: 30,
    width: active === 'active' ? 170 : 30,
    '& input': {
      color: styled.text.secondary,
      border: 'none',
      background: 'none',
      outline: 'none !important',
      boxShadow: 'none',
      fontWeight: styled.font.weight,
      fontFamily: styled.font.family,
      fontSize: styled.responsive[device].text.primary,
      padding: '0 10px',
      width: '100%',
    },
    '& button.search-btn': {
      position: 'absolute',
      right: 0,
      color: styled.text.secondary,
    },
    '& button': {
      color: styled.text.secondary,
    },
  })
)

export const CustomFilterButton = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: `${styled.color.info}22`,
    borderRadius: styled.radius.primary,
    height: 36,
    width: 40,
    '& button': {
      color: styled.color.info,
    },
  })
)

export const CustomMiniFilterButton = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    '& button': {
      color: styled.text.secondary,
      padding: 5,
    },
  })
)

export const CustomOptionButton = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: `${styled.color.info}22`,
    borderRadius: styled.radius.primary,
    height: 36,
    width: 40,
    '& button': {
      color: styled.color.info,
    },
  })
)

export const CustomDropdownButton = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    '& button': {
      color: styled.text.secondary,
    },
  })
)

export const CustomHeaderButton = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: `${styled.color.info}22`,
    borderRadius: styled.radius.primary,
    height: 36,
    width: 40,
    '& button': {
      color: styled.color.info,
    },
  })
)

export const CustomMenu = styled(Menu)(
  ({ styled }: { styled: IThemeStyle }) => ({
    '& div.MuiPaper-root': {
      backgroundColor: styled.background.secondary,
      color: styled.text.secondary,
      padding: 0,
      marginTop: 2,
      '& ul ul': {
        padding: '10px 20px',
        fontFamily: styled.font.family,
        fontWeight: styled.font.weight,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: styled.active.secondary,
        },
      },
    },
  })
)

export const CustomTextEllipsis = styled('div')(
  {
    position: 'relative',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
    overflow: 'hidden',
  }
)

export const StyledThermalBorder = styled('div')(
  ({ styled, position }: { styled: IThemeStyle, position: 'top' | 'bottom' }) => ({
    display: 'flex',
    position: 'absolute',
    [position]: 10,
    left: 1,
    '& span': {
      width: 30,
      height: 30,
      backgroundColor: styled.background.primary,
      display: 'block',
      margin: 1,
      borderRadius: '50%',
    }
  })
)

export * from './container'
export * from './form'
export * from './calendar'
