import { useContext } from 'react'
import { NotifyContext } from 'contexts/notify/NotifyContext'

const useNotify = () => useContext(NotifyContext)

export default useNotify