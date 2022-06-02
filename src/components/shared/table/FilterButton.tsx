import FilterListIcon from '@mui/icons-material/FilterList'
import { CustomFilterButton } from 'styles'
import { IconButton } from '@mui/material'
import useTheme from 'hooks/useTheme'

export const FilterButton = ({ ...props }) => {
  const { theme } = useTheme()

  return <CustomFilterButton styled={theme} {...props}>
    <IconButton>
      <FilterListIcon />
    </IconButton>
  </CustomFilterButton>
}
