import Dialog from '@mui/material/Dialog'
import useTheme from 'hooks/useTheme';

export const AlertDialog = ({ isOpen, handleClose, children }) => {
  const { theme } = useTheme()

  return (
    <div>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: theme.radius.quaternary,
            backgroundColor: theme.background.primary,
            minWidth: 'fit-content'
          }
        }}
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {children}
      </Dialog>
    </div>
  );
}
