import { IconButton } from '@mui/material'
import { CustomMenu } from 'styles'
import useTheme from 'hooks/useTheme'
import {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react'

export const MenuDialog = forwardRef(
  ({ label, children, anchorOrigin = { vertical: 'bottom', horizontal: 'center' }, transformOrigin = { vertical: 'top', horizontal: 'center' }, ...props }: any, ref) => {
    const { theme } = useTheme()
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)

    const handleClose = () => {
      setAnchorEl(null)
    }

    useImperativeHandle(ref, () => ({
      callCloseMenu() {
        handleClose()
      },
    }))

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
          onClose={handleClose}
          anchorEl={anchorEl}
          id='menu'
          styled={theme}
          style={{ maxHeight: 500 }}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
        >
          {children}
        </CustomMenu>
      </>
    )
  }
)
