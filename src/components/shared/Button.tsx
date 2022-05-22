import useTheme from 'hooks/useTheme'
import useWeb from 'hooks/useWeb'
import React from 'react'
import { CustomButton } from 'styles'

const Button = ({ children, ...prop }) => {
    const { theme } = useTheme()
    const { device } = useWeb()
  return (
    <CustomButton styled={theme} device={device} {...prop}>{children}</CustomButton>
  )
}

export default Button