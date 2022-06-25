import { MenuList } from '@mui/material';
import { styled } from '@mui/system'
import { IThemeStyle } from 'contexts/theme/interface'

export const CustomNestedMenuList = styled(MenuList)(
  ({ styled }: { styled: IThemeStyle }) => ({
    boxSizing: 'border-box',
    padding: '0 !important',
    '& .label': {
      cursor: 'default',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      '& svg': {
        fontSize: 21,
      },
      '&:hover': {
        backgroundColor: `${styled.active.secondary} !important`,
      }
    },
    '&:hover': {
      backgroundColor: `${styled.background.secondary} !important`,
    },
    '&:hover .nested-menu': {
      height: 270
    },
    '& .nested-menu': {
      transition: '0.3s ease',
      overflow: 'hidden',
      height: 0,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      '& *': {
        padding: '10px 20px 10px 30px',
        color: `${styled.text.secondary} !important`,
        '&:hover': {
          backgroundColor: `${styled.active.secondary} !important`,
        }
      }
    }
  })
)
