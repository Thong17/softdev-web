import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import { MenuDialog } from '../MenuDialog'
import { CustomFilterButton, CustomMiniFilterButton } from 'styles'
import useTheme from 'hooks/useTheme'

export const FilterButton = ({ children, ...props }) => {
  const { theme } = useTheme()

  return <CustomFilterButton styled={theme} {...props}>
    <MenuDialog 
      label={<FilterListRoundedIcon />}
    >
      {children}
    </MenuDialog> 
  </CustomFilterButton>
}

export const MiniFilterButton = ({ children, ...props }) => {
  const { theme } = useTheme()

  return <CustomMiniFilterButton styled={theme} {...props}>
    <MenuDialog 
      label={<FilterListRoundedIcon fontSize='small' />}
    >
      {children}
    </MenuDialog> 
  </CustomMiniFilterButton>
}

