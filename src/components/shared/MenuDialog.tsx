import { ButtonProps, IconButton } from '@mui/material'
import { CustomMenu } from 'styles'
import useTheme from 'hooks/useTheme'
import { FC, ReactElement, useState } from 'react'

interface IMenuDialog extends ButtonProps {
  label?: ReactElement
}

export const MenuDialog: FC<IMenuDialog> = ({ label, children, ...props }) => {
  const { theme } = useTheme()
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  return (
    <>
      {label && (
        <IconButton
          aria-controls='menu'
          onClick={(event) => setAnchorEl(event.currentTarget)}
          {...props}
        >
          {label}
        </IconButton>
      )}
      <CustomMenu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        id='menu'
        styled={theme}
        style={{ maxHeight: 500 }}
      >
        {children}
      </CustomMenu>
    </>
  )
}
