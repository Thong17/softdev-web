import { useContext } from 'react'
import { OfflineContext } from 'contexts/offline/OfflineContext'

const useOffline = () => useContext(OfflineContext)

export default useOffline
