import { sha256 } from 'js-sha256'
import { IToken } from 'contexts/auth/interface'
import jwtDecode from 'jwt-decode'

export const generateHash = async (
  ts: string,
  token: string = '',
  data?: object
) => {
  const str =
    JSON.stringify(data) +
    process.env.REACT_APP_HASH_SECRET +
    ts +
    token
  const hash = sha256.hex(str).toString()
  return hash
}

export const isValidToken = (token) => {
  if (!token) return false

  const decodedToken: IToken = jwtDecode(token)
  const currentTime = Date.now() / 1000
  return decodedToken.exp > currentTime
}

export const throttle = (cb, delay = 1000) => {
  let isWaiting = false
  let oldArgs

  const timeout = () => {
    if (oldArgs === null) {
      isWaiting = false
    } else {
      cb(...oldArgs)
      oldArgs = null
      setTimeout(timeout, delay)
    }
  }

  return (...args) => {
    if (isWaiting) {
      oldArgs = args
      return
    }
    cb(...args)
    isWaiting = true
    setTimeout(timeout, delay)
  }
}

export const debounce = (cb, delay = 1000) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}
