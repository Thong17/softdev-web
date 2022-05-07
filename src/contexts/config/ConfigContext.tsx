import { createContext, useState } from 'react'

const initState = {
  sidebar: localStorage.getItem('setting-sidebar') === 'true' ? true : false,
}
export const ConfigContext = createContext({
  ...initState,
  toggleSidebar: () => {},
})

const ConfigProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(initState.sidebar)

  const toggleSidebar = () => {
    const toggleSidebar = !sidebar
    setSidebar(toggleSidebar)
    localStorage.setItem('setting-sidebar', toggleSidebar ? 'true' : 'false')
  }

  return (
    <ConfigContext.Provider value={{ sidebar, toggleSidebar }}>
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
