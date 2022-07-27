import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import { CustomDropdownButton } from 'styles'
import { MenuDialog } from '../MenuDialog'
import useTheme from 'hooks/useTheme'

export const DropdownButton = ({ children, label, ...props }: any) => {
  const { theme } = useTheme()

  return <CustomDropdownButton styled={theme} {...props}>
    <MenuDialog 
      label={label ? label : <MoreHorizRoundedIcon />}
    >
      {children}
    </MenuDialog>
  </CustomDropdownButton>
}
