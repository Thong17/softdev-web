import { createContext, useState } from 'react'

const initState = {
  sidebar: false,
}
export const ConfigContext = createContext({
  ...initState,
  toggleSidebar: () => {}
})

const ConfigProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(initState.sidebar)

  const toggleSidebar = () => setSidebar(!sidebar)

  return <ConfigContext.Provider value={{ sidebar, toggleSidebar }}>{children}</ConfigContext.Provider>
}

export default ConfigProvider
