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
  theme: 'colored',
  closeButton: false,
}

export const NotifyContext = createContext({
  ...initState,
  notify: (message, type?: TypeOptions) => {},
  loadify: (promise) => { Promise.resolve() }
})

const NotifyProvider = ({ children }) => {
  const notify = (message: any, type?: TypeOptions) => {
    toast(message, { ...initState, type })
  }

  const loadify = (promise: Promise<Function>) => {
    toast.promise(promise, {
      pending: 'Loading',
      success: {
        render({data}) {
          return data
        }
      },
      error: {
        render({data}) {
          return data
        }
      }
    })
  }

  return (
    <NotifyContext.Provider value={{ ...initState, notify, loadify }}>
      {children}
      <ToastContainer className="toast-container" limit={5} />
    </NotifyContext.Provider>
  )
}

export default NotifyProvider
