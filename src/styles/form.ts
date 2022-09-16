import { IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'
import { styled } from '@mui/system'
import { INPUT_HEIGHT } from './constant'

export const CustomMiniSelect = styled('div')(
  ({
    styled,
    device,
    active,
    width
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    active: any
    width: number
  }) => ({
    minWidth: width,
    padding: 0,
    position: 'relative',
    '& .MuiSelect-select, & .MuiList-root li': {
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `13px !important`,
      padding: 0,
      '& .option-detail': {
        display: 'none'
      }
    },
    '& div': {
      zIndex: 10,
      color: styled.text.secondary,
      width: '100%',
      padding: 0,
      '& .MuiSelect-select': {
        minHeight: '30px !important',
        display: 'flex',
        alignItems: 'center',
      },
      '& div:hover, & div:focus': {
        color: styled.text.primary,
        '& ~ svg': {
          color: styled.text.primary,
        },
      },
      '& fieldset': {
        border: 'none',
      },
      '& svg': {
        color: styled.text.quaternary,
        fontSize: 27
      },
    },
  })
)

export const CustomEditorInput = styled('div')(
  ({
    styled,
    device,
    active,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    active: any
  }) => ({
    '& .rdw-editor-toolbar': {
      backgroundColor: styled.background.primary,
      '& div': {
        backgroundColor: styled.background.primary,
        color: `${styled.text.secondary} !important`
      }
    }
  })
)

export const CustomInput = styled('div')(
  ({
    styled,
    device,
    icon,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    icon: any
  }) => ({
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
      overflow: 'hidden',
    },
    '& input[type="date"]::-webkit-calendar-picker-indicator, & input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
      filter: 'invert(0.5)'
    },
    '& input': {
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      color: styled.text.primary,
      width: '100%',
      border: styled.border.quaternary,
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
        border: styled.border.tertiary,
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
      border: styled.border.quaternary,
      height: INPUT_HEIGHT,
      borderRadius: styled.radius.primary,
      padding: '10px 13px',
      outline: 'none !important',
      boxShadow: 'none',
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `${styled.responsive[device].text.primary} !important`,
      transition: '0.3s ease',
      '&:hover, &:focus': {
        border: styled.border.tertiary,
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
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
    },
    '& .icon': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.text.secondary,
      position: 'absolute',
      cursor: 'text',
      top: '38px',
      right: '10px',
      userSelect: 'none',
    },
    '& .err': {
      color: styled.color.error,
      transition: '0.3s ease',
      position: 'absolute',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
      left: 7,
      fontSize: styled.responsive[device]?.text.quaternary,
    },
  })
)

export const CustomMiniInput = styled('div')(
  ({
    styled,
    device,
    icon,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    icon: any
  }) => ({
    position: 'relative',
    padding: '20px 0 15px 0',
    overflow: 'hidden',
    '& label': {
      transition: '0.2s ease',
      position: 'absolute',
      cursor: 'text',
      top: '30px',
      left: '14px',
      fontSize: styled.responsive[device]?.text.tertiary,
      color: styled.text.quaternary,
      userSelect: 'none',
      display: 'inline',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
    },
    '& input[type="date"]::-webkit-calendar-picker-indicator, & input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
      filter: 'invert(0.5)'
    },
    '& input': {
      position: 'relative',
      zIndex: 10,
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      color: styled.text.primary,
      width: '100%',
      border: styled.border.quaternary,
      height: INPUT_HEIGHT,
      borderRadius: styled.radius.primary,
      padding: icon ? '0 40px 0 11px' : '0 11px',
      outline: 'none !important',
      boxShadow: 'none',
      transition: '0.3s ease',
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `${styled.responsive[device].text.tertiary} !important`,
      '&:hover, &:focus': {
        border: styled.border.tertiary,
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
      border: styled.border.quaternary,
      height: INPUT_HEIGHT,
      borderRadius: styled.radius.primary,
      padding: '10px 13px',
      outline: 'none !important',
      boxShadow: 'none',
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `${styled.responsive[device].text.tertiary} !important`,
      transition: '0.3s ease',
      '&:hover, &:focus': {
        border: styled.border.tertiary,
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
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
    },
    '& .icon': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.text.secondary,
      position: 'absolute',
      cursor: 'text',
      top: '38px',
      right: '10px',
      userSelect: 'none',
    },
    '& .err': {
      color: styled.color.error,
      transition: '0.3s ease',
      position: 'absolute',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
      left: 7,
      fontSize: styled.responsive[device]?.text.quaternary,
    },
  })
)

export const CustomProfileUpload = styled('div')(
  ({ styled, device }: { styled: IThemeStyle; device: DeviceOptions }) => ({
    padding: '20px 0 20px 0',
    position: 'relative',
    '& label.input, & .container': {
      color: styled.text.tertiary,
      backgroundColor: 'transparent',
      display: 'grid',
      placeItems: 'center',
      borderRadius: styled.radius.primary,
      border: styled.border.quaternary,
      borderStyle: 'dashed !important',
      padding: '0 13px',
      cursor: 'pointer',
      overflow: 'hidden',
      transition: '0.3s ease',
      '&:hover, &:focus': {
        border: styled.border.tertiary,
      },
    },
    '& input': {
      display: 'none',
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
      overflow: 'hidden',
    },
    '& .hint': {
      fontSize: styled.responsive[device].text.quaternary,
      color: styled.color.info,
      position: 'absolute',
      cursor: 'text',
      top: '15px',
      right: '6px',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
    },
    '& label.input, & .container': {
      color: styled.text.tertiary,
      backgroundColor: 'transparent',
      width: 'calc(100% - 28px)',
      display: 'flex',
      justifyContent: 'center',
      alignItem: 'center',
      borderRadius: styled.radius.primary,
      border: styled.border.quaternary,
      borderStyle: 'dashed !important',
      padding: '0 13px',
      cursor: 'pointer',
      overflow: 'hidden',
      transition: '0.3s ease',
      '&:hover, &:focus': {
        border: styled.border.tertiary,
      },
    },
    '& .container': {
      cursor: 'default',
    },
    '& .container label': {
      cursor: 'pointer',
      position: 'absolute',
      top: 35,
      right: 10,
      width: 30,
      height: 30,
      display: 'flex',
      alignItems: 'center',
    },
    '& .container .img-container': {
      cursor: 'pointer',
      position: 'relative',
      width: '100%',
      height: '100%',
      '& .action': {
        position: 'absolute',
        top: 7,
        right: 7,
        '& button': {
          color: styled.color.error,
          backgroundColor: `${styled.color.error}33`,
        },
      },
      '& label.image': {
        display: 'block',
        position: 'absolute',
        top: 15,
        left: 15,
        width: 20,
        height: 20,
        backgroundColor: styled.background.primary,
        border: styled.border.quaternary,
        borderRadius: styled.radius.primary,
        '&.active': {
          backgroundColor: styled.color.success,
        },
      },
    },
    '& .navigationButton': {
      position: 'absolute',
      bottom: 20,
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
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
    },
  })
)

export const CustomSelect = styled('div')(
  ({
    styled,
    device,
    active,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    active: any
  }) => ({
    minWidth: 130,
    padding: '30px 0 20px 0',
    position: 'relative',
    '& label': {
      transition: '0.2s ease',
      position: 'absolute',
      cursor: 'text',
      color: active ? styled.text.secondary : styled.text.quaternary,
      userSelect: 'none',
      fontSize: active
        ? styled.responsive[device]?.text.quaternary
        : styled.responsive[device]?.text.primary,
      top: active ? '15px' : '39px',
      left: active ? '6px' : '14px',
      display: 'inline',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
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
        border: styled.border.quaternary,
        transition: '0.3s ease',
      },
      '& div:hover, & div:focus': {
        border: styled.border.tertiary,
      },
      '& fieldset': {
        border: 'none',
      },
      '& svg': {
        color: styled.text.quaternary,
        fontSize: 30
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
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden',
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
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  })
)
