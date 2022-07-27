import SwitchRightRoundedIcon from '@mui/icons-material/SwitchRightRounded'
import SwitchLeftRoundedIcon from '@mui/icons-material/SwitchLeftRounded'
import useTheme from 'hooks/useTheme'

export const SortIcon = ({ asc = false }) => {
    const { theme } = useTheme()
  return (
    asc 
        ? <SwitchRightRoundedIcon style={{ color: theme.text.secondary }} />
        : <SwitchLeftRoundedIcon style={{ color: theme.text.secondary }} />
  )
}
