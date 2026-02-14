import React from "react"
import { ButtonProps, CircularProgress, IconButton } from "@mui/material"

interface CustomIconButtonProps extends ButtonProps {
  isLoading?: boolean
}

export const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  isLoading = false,
  children,
  disabled,
  ...rest
}) => {
  return (
    <IconButton
      {...rest}
      disabled={isLoading || disabled}
    >
      {isLoading ? <CircularProgress size={16} color="inherit" /> : children}
    </IconButton>
  )
}