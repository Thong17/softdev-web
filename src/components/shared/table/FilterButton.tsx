import FilterListIcon from '@mui/icons-material/FilterList'
import { MenuDialog } from '../MenuDialog'
import { CustomFilterButton } from 'styles'
import useTheme from 'hooks/useTheme'

export const FilterButton = ({ children, ...props }) => {
  const { theme } = useTheme()

  return <CustomFilterButton styled={theme} {...props}>
    <MenuDialog 
      label={<FilterListIcon />}
    >
      {children}
    </MenuDialog> 
  </CustomFilterButton>
}
