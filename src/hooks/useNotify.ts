import { useContext } from 'react'
import { NotificationContext } from 'contexts/notify/NotificationContext'

const useNotify = () => useContext(NotificationContext)

export default useNotify
