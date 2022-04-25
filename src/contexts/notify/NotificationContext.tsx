import React, { useState } from 'react'
import { createContext } from 'react'
import { INotify } from './interface'
import { Snackbar } from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import { Slide } from '@mui/material'

const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
}

const initState: INotify = {
  severity: 'success',
  message: 'Success',
  open: false,
  horizontal: 'right',
  vertical: 'bottom'
}

export const NotificationContext = createContext({
  ...initState,
  notify: (msg, type) => {},
})

const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(initState)

  const notify = (msg, type) => {
    const newNotify = Object.assign(notification, { open: true, message: msg, severity: type })
    setNotification(newNotify)
  }

  const handleClose = (e, reason) => {
    if (reason === 'clickaway') return
    setNotification({ ...notification, open: false })
  }

  return (
    <NotificationContext.Provider value={{ ...initState, notify }}>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={notification.open}
        onClose={handleClose}
        autoHideDuration={6000}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert onClose={(e) => handleClose(e, '')} severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </MuiAlert>
      </Snackbar>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
