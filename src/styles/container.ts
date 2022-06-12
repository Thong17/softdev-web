import { styled } from '@mui/system'
import { shineLine } from './animation'
import { IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'

export const CustomTableContainer = styled('div')(
    ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
      backgroundColor: styled.background.primary,
      '& .table-container': {
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
        '& .skeleton': {
          backgroundImage: `linear-gradient(90deg, ${styled.background.quaternary} 0px, ${styled.active.tertiary} 40px, ${styled.background.quaternary} 80px)`,
          backgroundSize: '600px',
          color: `${styled.background.quaternary} !important`,
          borderRadius: styled.radius.primary,
          animation: `${shineLine} 1.6s infinite linear`,
        },
        '& .img.skeleton': {
          borderRadius: 0,
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
          padding: 7,
          backgroundColor: styled.background.secondary,
          boxShadow: styled.shadow.secondary,
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
      backgroundColor: 'red',
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
      '& div': {
        height: 100,
        backgroundColor: '#333'
      }
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        color: styled.text.primary
      },
      '& div.option-container': {
        position: 'relative',
        height: 98,
        border: styled.border.quaternary,
        borderRadius: styled.radius.secondary,
        overflow: 'hidden',
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
          transition: '0.3s ease'
        },
        '&:hover .action': {
          opacity: 0.9
        }
      }
    })
  )
  