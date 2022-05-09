import { DeviceOptions } from "./interface"

export const determineDevice = (width): DeviceOptions => {
  if (width < 640) {
    return 'mobile'
  } else if (width < 1024) {
    return 'tablet'
  } else if (width < 1200) {
    return 'laptop'
  } else {
    return 'desktop'
  }
}

export const initWidth = window.innerWidth
