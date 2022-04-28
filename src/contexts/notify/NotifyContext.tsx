import { toast, ToastContainer } from 'react-toastify'
import { createContext } from 'react'
import { ToastOptions, TypeOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Notify.css'

const initState: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored'
}

export const NotifyContext = createContext({
  ...initState,
  notify: (message, type?: TypeOptions) => {},
})

const NotifyProvider = ({ children }) => {
  const notify = (message: any, type?: TypeOptions) => {
    toast(message, { ...initState, type })
  }

  return (
    <NotifyContext.Provider value={{ ...initState, notify }}>
      {children}
      <ToastContainer className="toast-container" limit={5} />
    </NotifyContext.Provider>
  )
}

export default NotifyProvider
