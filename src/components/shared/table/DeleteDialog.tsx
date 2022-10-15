import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useLanguage from 'hooks/useLanguage'

export const DeleteDialog = ({ title, description, action, id, isOpen, handleConfirm, handleClose }: any) => {
  const { language } = useLanguage()
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title || language['CONFIRM_DELETE']}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description || language['DESCRIPTION_DELETE']}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{language['CANCEL']}</Button>
          <Button onClick={() => handleConfirm(id)} variant='contained' color='error' autoFocus>
            {action || language['DELETE']}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
