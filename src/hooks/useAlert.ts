import { useContext } from 'react'
import { AlertContext } from 'contexts/alert/AlertContext'

const useAlert = () => useContext(AlertContext)

export default useAlert
