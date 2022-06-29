import { createContext, useState } from 'react'

interface IConfig {
  sidebar: boolean,
  display: 'grid' | 'list'
}

const initState: IConfig = {
  sidebar: localStorage.getItem('setting-sidebar') === 'true' ? true : false,
  display: localStorage.getItem('setting-display') === 'list' ? 'list' : 'grid',
}
export const ConfigContext = createContext({
  ...initState,
  toggleSidebar: () => {},
  toggleDisplay: (display) => {},
})

const ConfigProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(initState.sidebar)
  const [display, setDisplay] = useState<'grid' | 'list'>(initState.display)

  const toggleSidebar = () => {
    const toggleSidebar = !sidebar
    setSidebar(toggleSidebar)
    localStorage.setItem('setting-sidebar', toggleSidebar ? 'true' : 'false')
  }

  const toggleDisplay = (display) => {
    setDisplay(display)
    localStorage.setItem('setting-display', display)
  }

  return (
    <ConfigContext.Provider value={{ sidebar, display, toggleSidebar, toggleDisplay }}>
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
