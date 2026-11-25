import Dialog from '@mui/material/Dialog'
import useTheme from 'hooks/useTheme';

// `keepMounted` (optional): the content stays rendered while closed, so a big
// form opens with a smooth fade instead of being built at the moment it opens
export const AlertDialog = ({ isOpen, handleClose, children, hasTransparent, keepMounted }: any) => {
  const { theme } = useTheme()

  return (
    <div>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: theme.radius.quaternary,
            backgroundColor: hasTransparent ? 'transparent' : theme.background.primary,
            minWidth: 'fit-content'
          }
        }}
        open={isOpen}
        keepMounted={!!keepMounted}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {children}
      </Dialog>
    </div>
  );
}
