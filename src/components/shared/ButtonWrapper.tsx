import React from "react"
import { Button, ButtonProps, CircularProgress } from "@mui/material"

interface CustomButtonProps extends ButtonProps {
  isLoading?: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
  isLoading = false,
  children,
  disabled,
  ...rest
}) => {
  return (
    <Button
      {...rest}
      disabled={isLoading || disabled}
    >
      {isLoading && <CircularProgress size={16} sx={{ marginRight: 1 }} color="inherit" />}
      {children}
    </Button>
  )
}

export default CustomButton