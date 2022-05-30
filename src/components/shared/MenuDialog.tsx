import { IconButton, Menu } from '@mui/material'
import { FC, ReactElement, useState } from 'react'

interface IMenuDialog {
  label: ReactElement,
}

export const MenuDialog: FC<IMenuDialog> = ({ label, children }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  return (
    <>
      <IconButton
        aria-controls='menu'
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        {label}
      </IconButton>
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        id='menu'
        style={{
          marginTop: 10
        }}
      >
        {children}
      </Menu>
    </>
  )
}
