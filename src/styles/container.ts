import { Button } from '@mui/material'
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
      '& thead tr': {
        boxShadow: styled.shadow.bottom,
        borderRadius: styled.radius.primary,
        '& th:first-of-type': {
          borderRadius: `${styled.radius.primary} 0 0 ${styled.radius.primary}`,
          overflow: 'hidden',
        },
        '& th:last-of-type': {
          borderRadius: `0 ${styled.radius.primary} ${styled.radius.primary} 0`,
          overflow: 'hidden',
        }
      },
      '& th': {
        backgroundColor: styled.background.secondary,
        color: styled.text.primary,
        borderBottom: 0,
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
        position: 'relative',
        '&.active': {
          cursor: 'pointer'
        },
        '& .selected': {
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: styled.background.primary,
          opacity: 0.7
        },
        '& .favorite': {
          position: 'absolute',
          top: 5,
          right: 5,
          width: 25,
          height: 25,
          cursor: 'pointer',
          transition: '0.2s ease',
          borderRadius: styled.radius.primary,
          color: styled.text.secondary,
          display: 'grid',
          placeItems: 'center',
          '& svg.active': {
            color: styled.color.success,
          },
          '& svg': {
            fontSize: 23,
          }
        },
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
        backgroundColor: styled.background.primary,
        boxShadow: styled.shadow.secondary,
        boxSizing: 'border-box',
        border: styled.border.quaternary,
        '& .title': {
          fontSize: styled.responsive?.[device]?.text.quaternary,
          padding: '3px 5px 0 5px',
          color: styled.text.tertiary,
        },
        '& .sub-title': {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: styled.background.secondary,
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
            display: 'flex',
            alignItems: 'center'
          },
          '& .sub-left': {
            width: 'fit-content',
            fontSize: styled.responsive?.[device]?.text.primary,
            color: styled.text.secondary,
            display: 'flex',
            alignItems: 'center'
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
    boxSizing: 'border-box',
    '& .list-item': {
      boxSizing: 'border-box',
      padding: '7px 7px 7px 0',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      borderRadius: styled.radius.primary,
      marginBottom: 10,
      cursor: 'pointer',
      transition: '0.2s ease',
      '&:hover': {
        backgroundColor: styled.background.secondary
      }
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
      },
    },
    '& .img': {
      width: 100,
      height: 70,
      '& img': {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
      },
    },
    '& .content': {
      marginLeft: 10,
      display: 'flex',
      flexDirection: 'column',
      '& .subject': {
        color: `${styled.text.tertiary} !important`,
      },
      '& .detail': {
        color: `${styled.text.quaternary} !important`,
        fontSize: styled.responsive?.[device]?.text.quaternary,
      },
      '& .price': {
        color: `${styled.color.info} !important`,
        fontSize: styled.responsive?.[device]?.text.h3,
      },
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
      position: 'relative',
      border: styled.border.quaternary,
      borderRadius: styled.radius.ternary,
      padding: 10,
      boxSizing: 'border-box',
      '& .select': {
        position: 'absolute',
        top: 8,
        right: 10,
        zIndex: 10,
      },
      '& .action': {
        position: 'absolute',
        padding: '5px 5px 5px 0',
        top: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: styled.background.primary,
        opacity: 0,
        transition: '0.3s ease',
        borderRadius: styled.radius.primary
      },
      '&:hover .action': {
        opacity: 0.9,
      },
      '& .option-detail': {
        display: 'flex',
        flexDirection: 'column',
        '& .title': {
          color: styled.text.primary
        },
        '& .description': {
          color: styled.text.tertiary,
          fontSize: styled.responsive[device]?.text.quaternary
        }
      },
      '& .option-price': {
        display: 'flex',
        justifyContent: 'end'
      }
    },
    '& button.create-button': {
      height: 100,
      borderRadius: styled.radius.ternary,
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

export const CustomCustomerOptionContainer = styled('div')(
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
      position: 'relative',
      border: styled.border.quaternary,
      borderRadius: styled.radius.ternary,
      padding: '10px 0',
      boxSizing: 'border-box',
      '& .select': {
        position: 'absolute',
        top: 8,
        right: 10,
        zIndex: 10,
      },
      '& .action': {
        position: 'absolute',
        padding: '5px 5px 5px 0',
        top: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: styled.background.primary,
        opacity: 0,
        transition: '0.3s ease',
        borderRadius: styled.radius.primary
      },
      '&:hover .action': {
        opacity: 0.9,
      },
      '& .option-detail': {
        display: 'flex',
        flexDirection: 'column',
        '& .title': {
          color: styled.text.primary
        },
        '& .description': {
          color: styled.text.tertiary,
          fontSize: styled.responsive[device]?.text.quaternary
        }
      },
      '& .option-price': {
        display: 'flex',
        justifyContent: 'end'
      }
    },
    '& button.create-button': {
      height: 100,
      borderRadius: styled.radius.ternary,
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
      borderRadius: styled.radius.ternary,
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
      height: 100,
      border: styled.border.quaternary,
      borderRadius: styled.radius.ternary,
      overflow: 'hidden',
      padding: 10,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      '& .select': {
        position: 'absolute',
        top: 8,
        right: 10,
        zIndex: 10,
      },
      '& .action': {
        position: 'absolute',
        padding: '5px 5px 5px 0',
        top: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: styled.background.primary,
        opacity: 0,
        transition: '0.3s ease',
        borderRadius: styled.radius.primary
      },
      '&:hover .action': {
        opacity: 0.9,
      },
      '& .option-detail': {
        display: 'flex',
        flexDirection: 'column',
        '& .title': {
          color: styled.text.primary
        },
        '& .description': {
          color: styled.text.tertiary,
          fontSize: styled.responsive[device]?.text.quaternary
        }
      },
      '& .option-price': {
        display: 'flex',
        justifyContent: 'end'
      }
    },
  })
)

export const CustomProductInfo = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    position: 'relative',
    color: styled.text.secondary,
    '& .container': {
      backgroundColor: 'transparent',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItem: 'center',
      borderRadius: styled.radius.ternary,
      border: styled.border.quaternary,
      overflow: 'hidden',
      position: 'relative',
      boxSizing: 'border-box',
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
      padding: 7,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: styled.radius.ternary,
      margin: '10px 0',
      boxShadow: styled.shadow.secondary,
      border: styled.border.quaternary,
    },
    '& .color-container': {
      '& .color': {
        padding: 5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: styled.radius.ternary,
        boxShadow: styled.shadow.secondary,
        backgroundColor: styled.background.secondary,
        marginBottom: 10,
        boxSizing: 'border-box',
        position: 'relative',
        '& .code': {
          height: '100%', 
          display: 'block',
          borderRadius: 2,
          boxShadow: styled.shadow.inset,
        },
      },
    },
  })
)

export const CustomDetailContainer = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    padding: 20,
    width: 700
  })
)

export const CustomInvoiceContainer = styled('div')(
  ({
    styled,
    mode,
    font,
  }: {
    styled: IThemeStyle
    mode: 'preview' | 'invoice'
    font: string
  }) => ({
    padding: '40px 20px',
    borderRadius: styled.radius.ternary,
    color: mode === 'preview' ? styled.text.secondary : '#222',
    backgroundColor:
      mode === 'preview' ? styled.background.secondary : '#ffffff',
    fontFamily: `${font} !important`,
    '& th': {
      fontFamily: `${font} !important`,
      fontSize: 18,
    },
    '& td': {
      fontFamily: `${font} !important`,
      fontWeight: 300
    },
  })
)

export const CustomReceiptContainer = styled('div')(
  ({
    styled,
    mode,
    font,
  }: {
    styled: IThemeStyle
    mode: 'preview' | 'invoice'
    font: string
  }) => ({
    padding: '40px 30px 40px 0',
    color: mode === 'preview' ? styled.text.secondary : '#222',
    backgroundColor:
      mode === 'preview' ? styled.background.secondary : '#ffffff',
    '& th': {
      fontSize: 28,
      fontFamily: `${font} !important`,
    },
    '& td': {
      fontWeight: '300 !important',
      fontSize: 24
    },
  })
)

export const CustomInvoiceForm = styled('div')(
  ({
    styled,
    device,
    mode,
    height = 'fit-content',
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    mode: 'compact' | 'expand'
    height?: string
  }) => ({
    overflowX: 'hidden',
    overflowY: 'visible',
    position: 'sticky',
    top: 30,
    boxSizing: 'border-box',
    background: `linear-gradient(0deg, ${styled.background.secondary}cc, ${styled.background.secondary}77)`,
    minWidth: device === 'laptop' || device === 'desktop' ? (mode === 'expand' ? 460 : 50) : '100%', 
    maxWidth: device === 'laptop' || device === 'desktop' ? 460 : '100%',
    minHeight: device === 'laptop' || device === 'desktop' ? '80vh' : (mode === 'expand' ? '80vh' : 50),
    borderRadius: styled.radius.ternary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: height,
    '.toggle': {
      width: 50, 
      height: 50, 
      display: 'grid', 
      placeItems: 'center', 
      cursor: 'pointer',
      color: styled.text.secondary,
      '&:hover': {
        color: styled.color.info
      }
    },
    '.invoice-form': {
      minHeight: device === 'laptop' || device === 'desktop' ? 300 : (mode === 'expand' ? 300 : 0),
      padding: '0 10px',
      '& .form': {
        display: mode === 'expand' ? 'block' : 'none',
        fontSize: styled.responsive[device]?.text.quaternary,
        color: styled.text.secondary,
        padding: '10px 0',
        '& .item': {
          position: 'relative',
          border: styled.border.dashed,
          borderRadius: styled.radius.ternary,
          cursor: 'pointer',
          padding: '7px 11px 7px 9px',
          marginBottom: 10,
          '& .item-description': {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            '& .profile': {
              marginRight: 10
            },
            '& .description': {
              display: 'flex',
              flexDirection: 'column',
              flex: '0 60%',
            },
            '& .main-description': {
              fontSize: 12,
              color: styled.text.quaternary,
              wordBreak: 'break-all'
            },
            '& .sub-description': {
              height: 20,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
            },
            '& .discount': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              flex: '0 15%'
            },
            '& .quantity': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: '0 25%'
            },
            '& .total': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: '0 25%'
            },
          },
          '& .item-form': {
            padding: '0'
          },
          '&.active': {
            backgroundColor: `${styled.background.primary}88`,
            borderColor: `${styled.background.primary}11`,
            cursor: 'auto'
          }
        }
      }
    },
    '.invoice-total': {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      '& .total-container': {
        padding: '0 10px',
        height: '100%',
        width: '100%',
        '& .charge': {
          display: mode === 'expand' ? 'flex' : 'none', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          boxSizing: 'border-box',
          padding: '10px 0',
          height: 'calc(100% - 60px)',
          width: '100%',
          backgroundColor: `${styled.background.primary}77`,
          borderRadius: `${styled.radius.ternary} ${styled.radius.ternary} 11px 11px`,
          '& .item': {
            boxSizing: 'border-box',
            width: '100%',
            padding: '5px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 31,
            '& span:hover': {
              color: styled.text.primary,
              cursor: 'pointer'
            },
            '& span svg': {
              fontSize: 12
            }
          }
        },
        '& .total': {
          display: mode === 'expand' ? 'flex' : 'none', 
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          padding: '0 20px',
          height: 50,
          width: '100%',
          backgroundColor: `${styled.background.primary}77`,
          borderRadius: `11px 11px ${styled.radius.ternary} ${styled.radius.ternary}`,
          position: 'relative',
          '&::before': {
            content: `''`,
            borderTop: styled.border.dashed,
            position: 'absolute',
            top: -1,
            left: 10,
            display: 'block',
            width: 'calc(100% - 20px)'
          }
        }
      }
    },
    '.invoice-payment': {
      height: device === 'laptop' || device === 'desktop' ? 57 : (mode === 'expand' ? 57 : 0),
      display: 'flex',
      alignItems: 'center',
      '& .total-container': {
        padding: '0 10px',
        width: '100%',
        '& .total': {
          display: mode === 'expand' ? 'block' : 'none',
          boxSizing: 'border-box',
          width: '100%',
        }
      }
    }
  })
)

export const CustomStructureLayout = styled('div')(
  ({ styled }: { styled: IThemeStyle }) => ({
    height: '75vh',
    width: '100%',
    position: 'relative',
    borderRadius: styled.radius.primary,
    overflow: 'hidden',
    '& .column': {
      padding: 5,
      boxSizing: 'border-box',
      width: '100%',
      position: 'absolute',
      backgroundColor: styled.background.secondary,
      zIndex: 1000,
      boxShadow: styled.shadow.bottom
    },
    '& .row': {
      padding: 5,
      boxSizing: 'border-box',
      height: '100%',
      position: 'absolute',
      backgroundColor: styled.background.secondary,
      zIndex: 1000,
    },
    '& .structure-container': {
      width: '100%',
      height: '100%',
      padding: '40px 0 0 40px',
      boxSizing: 'border-box',
      overflow: 'auto',
      '& .structure': {
        border: styled.border.dashed,
        borderWidth: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 150,
        minHeight: 150,
        position: 'relative',
        '& .action.blank': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        },
        '& .action.object': {
          display: 'none',
          position: 'absolute',
          top: 5, 
          right: 5,
        },
        '&:hover .action.object': {
          display: 'block'
        },
        '&.selected': {
          backgroundColor: `${styled.color.info}11`
        }
      }
    }
  })
)

export const CustomCustomerContainer = styled(Button)(
  ({ styled, device }: { styled: IThemeStyle, device: DeviceOptions }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '3px 5px 3px 0px',
    borderRadius: styled.radius.secondary,
    color: styled.text.secondary,
    fontSize: styled.responsive[device]?.text.tertiary,
    textTransform: 'none',
    '&:hover': {
      color: styled.text.primary
    }
  })
)
