import { styled } from '@mui/system'
import { shineLine } from './animation'
import { Button, Menu, Stack } from '@mui/material'
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
    borderRadius: styled.radius.secondary,
    '& a': {
      color: styled.text.primary,
      borderRadius: styled.radius.secondary,
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
    width: '100%',
    height: '500%',
    backgroundColor: styled.background.primary,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
      backgroundColor: styled.background.secondary,
      color: styled.text.primary,
    },
    '& a:hover': {
      textDecoration: 'underline',
      color: styled.text.primary,
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
      borderRight: styled.border.secondary,
    },
  })
)

export const CustomInput = styled('div')(
  ({ styled, device, icon }: { styled: IThemeStyle; device: DeviceOptions, icon: any }) => ({
    position: 'relative',
    padding: '30px 0 20px 0',
    overflow: 'hidden',
    '& label': {
      transition: '0.2s ease',
      position: 'absolute',
      cursor: 'text',
      top: '39px',
      left: '14px',
      fontSize: styled.responsive[device]?.text.primary,
      color: styled.text.quaternary,
      userSelect: 'none',
      display: 'inline',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden'
    },
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
      padding: icon ? '0 40px 0 13px' : '0 13px',
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
        backgroundColor: 'inherit',
        fontSize: styled.responsive[device].text.quaternary,
        color: styled.text.secondary,
      },
      '&[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button':
        {
          appearance: 'none',
        },
      '&.input-error': {
        borderColor: styled.color.error,
        '& ~ .err, & ~ label': {
          color: styled.color.error,
        },
      },
    },
    '& textarea': {
      minHeight: 37,
      maxHeight: 170,
      resize: 'vertical',
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      color: styled.text.primary,
      width: '100%',
      border: styled.border.tertiary,
      height: INPUT_HEIGHT,
      borderRadius: styled.radius.primary,
      padding: '10px 13px',
      outline: 'none !important',
      boxShadow: 'none',
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
        color: styled.text.secondary,
      },
      '&[type=number]::-webkit-inner-spin-button, &[type=number]::-webkit-outer-spin-button':
        {
          appearance: 'none',
        },
      '&.input-error': {
        borderColor: styled.color.error,
        '& ~ .err, & ~ label': {
          color: styled.color.error,
        },
      },
    },
    '& .hint': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.color.info,
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      right: '6px',
      userSelect: 'none',
    },
    '& .icon': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.text.secondary,
      position: 'absolute',
      cursor: 'text',
      top: '37px',
      right: '10px',
      userSelect: 'none',
    },
    '& .err': {
      color: styled.color.error,
      transition: '0.3s ease',
      position: 'absolute',
      left: 7,
      fontSize: styled.responsive[device]?.text.quaternary,
    },
  })
)

export const CustomUpload = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    padding: '30px 0 20px 0',
    position: 'relative',
    minWidth: 130,
    '& .label': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.text.secondary,
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      left: '6px',
      userSelect: 'none',
      display: 'inline',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden'
    },
    '& .hint': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.color.info,
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      right: '6px',
      userSelect: 'none',
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
      '&:hover, &:focus': {
        border: styled.border.secondary,
      },
    },
    '& label.input-error': {
      borderColor: styled.color.error,
      '& ~ .err, & ~ .label': {
        color: styled.color.error,
      },
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
    },
  })
)

export const CustomSelect = styled('div')(
  ({ styled, device, active }: { styled: IThemeStyle; device: DeviceOptions, active: any }) => ({
    minWidth: 130,
    padding: '30px 0 20px 0',
    position: 'relative',
    '& label': {
      transition: '0.2s ease',
      position: 'absolute',
      cursor: 'text',
      color: styled.text.secondary,
      userSelect: 'none',
      fontSize: active ? styled.responsive[device]?.text.quaternary : styled.responsive[device]?.text.primary,
      top: active ? '15px' : '39px',
      left: active ? '6px' : '14px',
      display: 'inline',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden'
    },
    '& .MuiSelect-select, & .MuiList-root li': {
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `${styled.responsive[device].text.primary} !important`,
    },
    '& div': {  
      zIndex: 10,
      color: styled.text.primary,
      width: '100%',
      padding: 0,
      '& div': {
        minHeight: '35px !important',
        padding: '0 13px',
        display: 'flex',
        alignItems: 'center',
        border: styled.border.tertiary,
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
        borderColor: styled.color.error,
      },
      '& ~ label, & ~ .err': {
        color: styled.color.error,
      },
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
      userSelect: 'none',
    },
  })
)

export const CustomButton = styled(Button)(
  ({ styled }: { styled: IThemeStyle }) => ({
    borderRadius: styled.radius.primary,
    padding: '6px 13px',
    overflow: 'hidden',
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
      backgroundColor: styled.background.primary
    },
    '& label span.Mui-disabled.MuiFormControlLabel-label, label span.Mui-disabled': {
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
        }
      }
    },
    '& .privilege-container': {
      marginLeft: 20,
      padding: '0 20px 20px 20px',
      '& div': {
        marginLeft: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
      }
    }
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
    }
  })
)

export const CustomSearchField = styled('div')(
  ({ styled, active, device }: { styled: IThemeStyle, active: string, device: DeviceOptions }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    transition: '0.2s ease',
    padding: '1px 4px 1px 5px',
    backgroundColor: styled.background.secondary,
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
      color: styled.text.secondary
    },
    '& button': {
      color: styled.text.secondary
    }
  })
)

export const CustomFilterButton = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styled.background.secondary,
    borderRadius: styled.radius.primary,
    height: 36,
    width: 40,
    '& button': {
      color: styled.text.secondary
    }
  })
)

export const CustomOptionButton = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styled.background.secondary,
    borderRadius: styled.radius.primary,
    height: 36,
    width: 40,
    '& button': {
      color: styled.text.secondary
    }
  })
)

export const CustomHeaderButton = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: styled.background.secondary,
    borderRadius: styled.radius.primary,
    height: 36,
    width: 40,
    '& button': {
      color: styled.text.secondary
    }
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
        }
      }
    }
  })
)

export const CustomTableContainer = styled('div')(
  ({ styled, device }: { styled: IThemeStyle, device: DeviceOptions }) => ({
    backgroundColor: styled.background.primary,
    '& .table-container': {
      position: 'relative',
      '& .table': {
        paddingBottom: 50, 
        overflowX: 'initial'
      },
      '& th': {
        backgroundColor: styled.background.secondary,
        color: styled.text.primary,
        borderBottom: styled.border.secondary,
        fontWeight: styled.font.weight,
        fontSize: styled.responsive[device]?.text.tertiary,
        padding: '11px 20px'
      }, 
      '& tr td': {
        color: styled.text.secondary,
        borderBottom: styled.border.quaternary,
        fontSize: styled.responsive[device]?.text.quaternary,
        fontWeight: styled.font.weight,
        padding: '11px 20px'
      }
    }
  })
)

export const CustomGridContainer = styled('div')(
  ({ styled, device }: { styled: IThemeStyle, device: DeviceOptions }) => ({
    padding: '10px 0',
    display: 'grid',
    gridGap: 20,
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 150px))',
    justifyContent: 'center',
    '& .grid-item': {
      position: 'relative',
      height: 200,
      width: '100%',
      backgroundColor: styled.background.primary,
      borderRadius: styled.radius.ternary,
      boxSizing: 'border-box',
      '&:hover .img .action': {
        opacity: 1
      },
      '& .skeleton': {
        backgroundImage: `linear-gradient(90deg, ${styled.background.quaternary} 0px, ${styled.active.tertiary} 40px, ${styled.background.quaternary} 80px)`,
        backgroundSize: '600px',
        color: `${styled.background.quaternary} !important`,
        borderRadius: styled.radius.primary,
        animation: `${shineLine} 1.6s infinite linear`,
      },
      '& .img.skeleton': {
        borderRadius: 0
      },
      '& .img': {
        borderRadius: styled.radius.ternary,
        overflow: 'hidden',
        width: '100%',
        height: 130,
        '& .status': {
          position: 'absolute',
          left: 10,
          top: 10,
          width: 13,
          height: 13,
          borderRadius: styled.radius.circle,
          boxShadow: styled.shadow.secondary,
          '&.active': {
            backgroundColor: styled.color.success,
          },
          '&.inactive': {
            backgroundColor: styled.color.error,
          }
        },
        '& .action': {
          transition: '0.3s ease',
          opacity: 0,
          backgroundColor: styled.background.primary,
          position: 'absolute',
          right: 7,
          top: 7,
          padding: '5px 5px 5px 0',
          display: 'flex',
          alignItem: 'center',
          justifyContent: 'space-between',
          width: 'fit-content',
          borderRadius: styled.radius.primary,
          '& span': {
            cursor: 'pointer',
            color: styled.text.tertiary,
            display: 'flex',
            alignItem: 'center',
            '& svg': {
              fontSize: styled.responsive[device]?.text.h5
            }
          },
          '& span:hover': {
            color: styled.text.primary
          }
        },
        '& img': {
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        },
      },
      '& .content': {
        marginTop: 5,
        borderRadius: styled.radius.ternary,
        width: '100%',
        padding: 5,
        backgroundColor: styled.background.secondary,
        boxSizing: 'border-box',
        '& .title': {
          position: 'relative',
          display: 'inline-block',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          width: '100%',
          overflow: 'hidden',
        },
        '& .sub-title': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItem: 'center',
          '& div': {
            position: 'relative',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            fontSize: styled.responsive?.[device]?.text.secondary,
            color: styled.text.secondary,
          },
          '& .sub-right': {
            marginLeft: 5,
            width: 'fit-content',
            fontSize: styled.responsive?.[device]?.text.quaternary,
            color: styled.text.quaternary,
          },
          '& .sub-left': {
            width: 'fit-content',
            fontSize: styled.responsive?.[device]?.text.quaternary,
            color: styled.text.quaternary,
          }
        }
      }
    },
  })
)

export const CustomListContainer = styled('div')(
  ({ styled, device, loading }: { styled: IThemeStyle, device: DeviceOptions, loading: string }) => ({
    backgroundColor: 'red',
  })
)

