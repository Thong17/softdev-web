import React from 'react'
import { ButtonProps } from '@mui/material'
import { MUIStyledCommonProps } from '@mui/system'
import useTheme from 'hooks/useTheme'
import { CustomButton } from 'styles'
import Loading from 'components/shared/icons/Loading'

interface IButton
  extends Omit<ButtonProps, 'classes' | 'sx'>,
    MUIStyledCommonProps {
  children: React.ReactNode
  loading?: boolean
}

const Button: React.FC<IButton> = ({ children, loading, ...prop }) => {
  const { theme } = useTheme()
  
  return (
    <CustomButton styled={theme} {...prop}>
      {children}
      {loading && <Loading />}
    </CustomButton>
  )
}

export default Button
