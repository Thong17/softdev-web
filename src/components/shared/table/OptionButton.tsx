import KeyboardOptionKeyIcon from '@mui/icons-material/KeyboardOptionKey';
import { CustomOptionButton } from 'styles'
import { MenuDialog } from '../MenuDialog'
import useTheme from 'hooks/useTheme'

export const OptionButton = ({ children, ...props }) => {
  const { theme } = useTheme()

  return <CustomOptionButton styled={theme} {...props}>
    <MenuDialog 
      label={<KeyboardOptionKeyIcon />}
    >
      {children}
    </MenuDialog>
  </CustomOptionButton>
}
