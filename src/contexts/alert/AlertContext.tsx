import { createContext, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export interface IAlertProps {
  title?: string
  description?: string
  variant?: 'info' | 'warning' | 'error'
}

export const AlertContext = createContext<(options: IAlertProps) => Promise<void>>(Promise.reject)

const AlertProvider = ({ children }) => {
  const [dialog, setDialog] = useState<IAlertProps & { open: boolean }>({ open: false })

  const awaitingPromiseRef = useRef<{
    resolve: () => void
    reject: () => void
  }>()

  const closeDialog = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject()
    }
    setDialog({ ...dialog, open: false })
  }

  const confirmDialog = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve()
    }
    setDialog({ ...dialog, open: false })
  }

  const confirm = (props: IAlertProps) => {
    setDialog({ ...props, open:true })

    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject }
    })
  }

  return (
    <AlertContext.Provider value={confirm}>
      {children}
      <Dialog
        open={dialog.open}
        onClose={closeDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{dialog?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {dialog?.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={confirmDialog}
            variant='contained'
            color={dialog?.variant || 'info'}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  )
}

export default AlertProvider
