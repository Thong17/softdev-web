import { toast, ToastContainer } from 'react-toastify'
import { createContext } from 'react'
import { ToastOptions, TypeOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Notify.css'

const initState: ToastOptions = {
  position: 'bottom-left',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  closeButton: false
}

export const NotifyContext = createContext({
  ...initState,
  notify: (message, type?: TypeOptions) => {},
  loadify: (promise) => { Promise.resolve() }
})

const NotifyProvider = ({ children }) => {
  const notify = (message: any, type?: TypeOptions) => {
    toast(message || 'Internal Server Error', { ...initState, type })
  }

  const loadify = (promise: Promise<Function>) => {
    toast.promise(promise, {
      pending: 'Loading',
      success: {
        render({data}: {data: any}) {
          return data?.data?.msg || 'Success'
        }
      },
      error: {
        render({data}: {data: any}) {
          return data?.response?.data?.msg || 'Internal Server Error'
        }
      }
    }, {
      ...initState
    }
    )
  }

  return (
    <NotifyContext.Provider value={{ ...initState, notify, loadify }}>
      {children}
      <ToastContainer className="toast-container" limit={5} newestOnTop />
    </NotifyContext.Provider>
  )
}

export default NotifyProvider
