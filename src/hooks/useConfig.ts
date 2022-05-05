import { useContext } from 'react'
import { ConfigContext } from 'contexts/config/ConfigContext'

const useConfig = () => useContext(ConfigContext)

export default useConfig