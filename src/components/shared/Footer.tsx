import useTheme from 'hooks/useTheme'
import { CustomFooter } from 'styles'

const Footer = () => {
  const { theme } = useTheme()

  return (
    <CustomFooter
      direction='row'
      justifyContent='center'
      alignItems='center'
      styled={theme}
    >
      Footer
    </CustomFooter>
  )
}

export default Footer
