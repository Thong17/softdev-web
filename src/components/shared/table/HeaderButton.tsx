import { CustomHeaderButton } from 'styles'
import useTheme from 'hooks/useTheme'
import { IconButton } from '@mui/material';

export const HeaderButton = ({ children, ...props }: any) => {
  const { theme } = useTheme()

  return <CustomHeaderButton styled={theme} {...props}>
    <IconButton>
      {children}
    </IconButton>
  </CustomHeaderButton>
}
