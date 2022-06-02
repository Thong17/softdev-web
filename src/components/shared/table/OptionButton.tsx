import KeyboardOptionKeyIcon from '@mui/icons-material/KeyboardOptionKey';
import { CustomOptionButton } from 'styles'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'

export const OptionButton = ({ ...props }) => {
  const { theme } = useTheme()

  return <CustomOptionButton styled={theme} {...props}>
    <IconButton>
      <KeyboardOptionKeyIcon />
    </IconButton>
  </CustomOptionButton>
}
