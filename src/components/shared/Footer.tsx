import useTheme from 'hooks/useTheme'
import { CustomFooter } from 'styles'

const Footer = ({ ...props }) => {
  const { theme } = useTheme()

  return (
    <CustomFooter
      direction='row'
      justifyContent='center'
      alignItems='center'
      styled={theme}
      {...props}
    >
      <p style={{ color: theme.text.tertiary }}>
        Copyright &copy; 2022 All Rights Reserved by <span style={{ color: theme.text.primary }}>SoftDev</span>
      </p>
    </CustomFooter>
  )
}

export default Footer
