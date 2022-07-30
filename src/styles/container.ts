import { styled } from '@mui/system'
import { IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'

export const CustomTableContainer = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    backgroundColor: styled.background.primary,
    '& .table-container': {
      maxWidth: '100%',
      position: 'relative',
      '& .table': {
        paddingBottom: 50,
        overflowX: 'initial',
      },
      '& th': {
        backgroundColor: styled.background.secondary,
        color: styled.text.primary,
        borderBottom: styled.border.secondary,
        fontWeight: styled.font.weight,
        fontSize: styled.responsive[device]?.text.tertiary,
        padding: '11px 20px',
        wordWrap: 'break-word',
      },
      '& tr td': {
        color: styled.text.secondary,
        borderBottom: styled.border.quaternary,
        fontSize: styled.responsive[device]?.text.quaternary,
        fontWeight: styled.font.weight,
        padding: '11px 20px',
        overflow: 'hidden',
      },
    },
  })
)

export const CustomGridContainer = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
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
        opacity: 1,
      },
      '& .img': {
        borderRadius: styled.radius.ternary,
        overflow: 'hidden',
        width: '100%',
        height: 130,
        boxShadow: styled.shadow.secondary,
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
          },
        },
        '& .action': {
          transition: '0.3s ease',
          opacity: 0,
          backgroundColor: `${styled.background.primary}99`,
          position: 'absolute',
          right: 7,
          top: 7,
          padding: '5px 5px 5px 0',
          display: 'flex',
          alignItem: 'center',
          justifyContent: 'space-between',
          width: 'fit-content',
          borderRadius: styled.radius.secondary,
          '& span': {
            cursor: 'pointer',
            color: styled.text.tertiary,
            display: 'flex',
            alignItem: 'center',
            '& svg': {
              fontSize: styled.responsive[device]?.text.h5,
            },
          },
          '& span:hover': {
            color: styled.text.primary,
          },
        },
        '& img': {
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        },
      },
      '& .content': {
        marginTop: 7,
        borderRadius: styled.radius.ternary,
        width: '100%',
        padding: 4,
        backgroundColor: styled.background.secondary,
        boxShadow: styled.shadow.secondary,
        boxSizing: 'border-box',
        '& .title': {
          fontSize: styled.responsive?.[device]?.text.quaternary,
          padding: '3px 5px 0 5px',
          color: styled.text.tertiary,
        },
        '& .sub-title': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: styled.background.primary,
          padding: '0 5px',
          borderRadius: styled.radius.secondary,
          height: 30,
          position: 'relative',
          boxSizing: 'border-box',
          '& .sub-right': {
            marginLeft: 5,
            width: 'fit-content',
            fontSize: styled.responsive?.[device]?.text.primary,
            color: styled.text.secondary,
          },
          '& .sub-left': {
            width: 'fit-content',
            fontSize: styled.responsive?.[device]?.text.primary,
            color: styled.text.secondary,
          },
        },
      },
    },
  })
)

export const CustomListContainer = styled('div')(
  ({
    styled,
    device,
    loading,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    loading: string
  }) => ({
    padding: '10px 0',
    '& .list-item': {
      boxSizing: 'border-box',
      padding: '10px 0',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      backgroundColor: styled.background.secondary,
      borderRadius: styled.radius.primary,
      marginBottom: 10
    },
    '& .status': {
      display: 'block',
      width: 17,
      height: 17,
      borderRadius: styled.radius.circle,
      boxShadow: styled.shadow.inset,
      '&.active': {
        backgroundColor: styled.color.success,
      },
      '&.inactive': {
        backgroundColor: styled.color.error,
      }
    },
    '& .img': {
      width: 100,
      height: 70,
      '& img': {
        objectFit: 'cover',
        width: '100%',
        height: '100%'
      }
    },
    '& .content': {
      marginLeft: 10,
      display: 'flex',
      flexDirection: 'column',
      '& .subject': {
        color: `${styled.text.tertiary} !important`
      },
      '& .price': {
        color: `${styled.color.info} !important`,
        fontSize: styled.responsive?.[device]?.text.h3
      }
    },
  })
)

export const CustomColorContainer = styled('div')(
  ({
    styled,
    device,
    loading,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    loading: string
  }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(130px, 1fr))`,
    gridGap: 20,
    '& div.color-container': {
      height: 100,
      backgroundColor: '#333',
      position: 'relative',
      borderRadius: styled.radius.secondary,
      padding: 10,
      boxSizing: 'border-box',
      '& .action': {
        width: '100%',
        transition: '0.3s ease',
        position: 'absolute',
        opacity: 0,
        backgroundColor: styled.background.primary,
      },
      '&:hover .action': {
        opacity: 0.9,
      },
    },
    '& button.create-button': {
      height: 100,
      borderRadius: styled.radius.secondary,
      border: styled.border.quaternary,
      borderColor: `${styled.color.info}55`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: styled.color.info,
      backgroundColor: `${styled.color.info}11`,
    },
  })
)

export const CustomOptionContainer = styled('div')(
  ({
    styled,
    device,
    loading,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    loading: string
  }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(130px, 1fr))`,
    gridGap: 20,
    '& button.create-button': {
      height: 100,
      borderRadius: styled.radius.secondary,
      border: styled.border.quaternary,
      borderColor: `${styled.color.info}55`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: styled.color.info,
      backgroundColor: `${styled.color.info}11`,
    },
    '& div.option-container': {
      position: 'relative',
      height: 98,
      border: styled.border.quaternary,
      borderRadius: styled.radius.secondary,
      overflow: 'hidden',
      padding: 10,
      boxSizing: 'border-box',
      '& .action': {
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: styled.background.primary,
        opacity: 0,
        transition: '0.3s ease',
      },
      '&:hover .action': {
        opacity: 0.9,
      },
    },
  })
)

export const CustomProductInfo = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    '& .container': {
      backgroundColor: 'transparent',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItem: 'center',
      borderRadius: styled.radius.primary,
      border: styled.border.tertiary,
      overflow: 'hidden',
      position: 'relative',
      boxSizing: 'border-box'
    },
    '& .container .img-container': {
      cursor: 'pointer',
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    '& .navigationButton': {
      position: 'absolute',
      bottom: 0,
      zIndex: 10,
      width: '100%',
      height: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& div': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        margin: '0 3px',
        borderRadius: styled.radius.circle,
        '& span': {
          display: 'inline-block',
          width: 15,
          height: 15,
          backgroundColor: styled.background.secondary,
          boxShadow: styled.shadow.inset,
          borderRadius: styled.radius.circle,
          cursor: 'pointer',
        },
      },
      '& div.active': {
        border: styled.border.quaternary,
        '& span': {
          backgroundColor: styled.active.primary,
        },
      },
    },
    '& .content': {
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: styled.background.secondary,
      borderRadius: styled.radius.primary,
      margin: '10px 0'
    },
    '& .color-container': {
      '& .color': {
        padding: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& .code': {
          width: 13,
          height: 13,
          borderRadius: styled.radius.circle,
          boxShadow: styled.shadow.inset
        }
      }
    }
  })
)

export const CustomDetailContainer = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    padding: 20
  })
)

export const CustomInvoiceContainer = styled('div')(
  ({ styled, mode, font }: { styled: IThemeStyle, mode: 'preview' | 'invoice', font: string }) => ({
    padding: '40px 20px',
    color: mode === 'preview' ? styled.text.secondary : '#222',
    backgroundColor: mode === 'preview' ? styled.background.secondary : '#ffffff',
    fontFamily: font,
    '& th': {
      fontFamily: font,
      fontSize: 18
    }
  })
)