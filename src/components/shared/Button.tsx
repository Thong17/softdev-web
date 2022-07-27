import React, { forwardRef, ForwardRefRenderFunction } from 'react'
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

const ButtonRef: ForwardRefRenderFunction<HTMLButtonElement, IButton> = ({ children, loading, ...prop }, ref) => {
  const { theme } = useTheme()
  
  return (
    <CustomButton styled={theme} {...prop} ref={ref}>
      {children}
      {loading && <Loading />}
    </CustomButton>
  )
}

const Button = forwardRef(ButtonRef)
export default Button
