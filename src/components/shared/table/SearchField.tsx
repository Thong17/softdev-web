import useTheme from "hooks/useTheme"
import { CustomSearchField } from 'styles'

export const SearchField = ({ ...props }) => {
  const { theme } = useTheme()
  
  return (
    <CustomSearchField styled={theme}>
      <input type='text' placeholder='Search' { ...props } />
    </CustomSearchField>
  )
}

