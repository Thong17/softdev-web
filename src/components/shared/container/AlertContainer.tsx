import Dialog from '@mui/material/Dialog'
import useTheme from 'hooks/useTheme'

export const AlertContainer = ({ isOpen, handleClose, children, justify }) => {
  const { theme } = useTheme()

  return (
    <div>
      <Dialog
        sx={{
          '& .MuiDialog-container': {
            justifyContent: justify,
          },
          '& .MuiDialog-paper': {
            backgroundColor: theme.background.primary,
            minWidth: 'fit-content',
            borderRadius: theme.radius.quaternary,
          },
        }}
        open={isOpen}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {children}
      </Dialog>
    </div>
  )
}
