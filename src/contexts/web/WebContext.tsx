import { createContext, useState } from 'react'
import { debounce } from 'utils'
import { determineDevice, initWidth } from './constant'
import { DeviceOptions, IWebContext } from './interface'

const initState: IWebContext = {
  width: initWidth,
  device: determineDevice(initWidth),
}

export const WebContext = createContext({ ...initState })

const WebProvider = ({ children }) => {
  const [width, setWidth] = useState(initState.width)
  const [device, setDevice] = useState<DeviceOptions>(initState.device)

  const updateWidth = debounce(() => {
    const windowWidth = window.innerWidth
    setWidth(windowWidth)
    setDevice(determineDevice(windowWidth))
  }, 500)

  window.addEventListener('resize', () => {
    updateWidth()
  })

  return (
    <WebContext.Provider value={{ width, device }}>
      {children}
    </WebContext.Provider>
  )
}

export default WebProvider
