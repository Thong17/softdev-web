import { createContext, useState } from 'react'

interface IConfig {
  sidebar: boolean,
  invoiceBar: boolean,
  display: 'grid' | 'list'
}

const initState: IConfig = {
  sidebar: localStorage.getItem('setting-sidebar') === 'true' ? true : false,
  invoiceBar: localStorage.getItem('setting-invoiceBar') === 'true' ? true : false,
  display: localStorage.getItem('setting-display') === 'list' ? 'list' : 'grid',
}
export const ConfigContext = createContext({
  ...initState,
  toggleSidebar: () => {},
  toggleInvoiceBar: () => {},
  toggleDisplay: (display) => {},
})

const ConfigProvider = ({ children }) => {
  const [sidebar, setSidebar] = useState(initState.sidebar)
  const [invoiceBar, setInvoiceBar] = useState(initState.invoiceBar)
  const [display, setDisplay] = useState<'grid' | 'list'>(initState.display)

  const toggleSidebar = () => {
    const toggleSidebar = !sidebar
    setSidebar(toggleSidebar)
    localStorage.setItem('setting-sidebar', toggleSidebar ? 'true' : 'false')
  }

  const toggleInvoiceBar = () => {
    const toggleInvoiceBar = !invoiceBar
    setInvoiceBar(toggleInvoiceBar)
    localStorage.setItem('setting-invoiceBar', toggleInvoiceBar ? 'true' : 'false')
  }

  const toggleDisplay = (display) => {
    setDisplay(display)
    localStorage.setItem('setting-display', display)
  }

  return (
    <ConfigContext.Provider value={{ sidebar, invoiceBar, display, toggleSidebar, toggleDisplay, toggleInvoiceBar }}>
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider
