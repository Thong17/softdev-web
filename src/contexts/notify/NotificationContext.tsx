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
  duration: 3000,
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
    setNotification({ ...notification, open: true, message: msg, severity: type })
  }
  
  const handleClose = (e?: any, reason?: string) => {
    if (reason === 'clickaway') return
    console.log(notification);
    
    setNotification({ ...notification, open: false })
  }

  return (
    <NotificationContext.Provider value={{ ...initState, notify }}>
      <Snackbar
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        open={notification.open}
        onClose={handleClose}
        autoHideDuration={notification.duration}
        TransitionComponent={SlideTransition}
      >
        <MuiAlert onClose={(e) => handleClose(e)} severity={notification.severity} variant="filled">
          {notification.message}
        </MuiAlert>
      </Snackbar>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
