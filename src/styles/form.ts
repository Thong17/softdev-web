import { IThemeStyle } from 'contexts/theme/interface'
import { DeviceOptions } from 'contexts/web/interface'
import { styled } from '@mui/system'

export const CustomMiniSelect = styled('div')(
  ({
    styled,
    device,
    active,
  }: {
    styled: IThemeStyle
    device: DeviceOptions
    active: any
  }) => ({
    minWidth: 70,
    padding: 0,
    position: 'relative',
    '& .MuiSelect-select, & .MuiList-root li': {
      fontFamily: `${styled.font.family} !important`,
      fontWeight: `${styled.font.weight} !important`,
      fontSize: `13px !important`,
      padding: 0
    },
    '& div': {
      zIndex: 10,
      color: styled.text.secondary,
      width: '100%',
      padding: 0,
      '& div': {
        minHeight: '30px !important',
        padding: '0 7px',
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
