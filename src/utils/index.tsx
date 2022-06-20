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

export const currencyFormat = (value, currency) => {
  const symbol = currency === 'USD' ? <>&#xFF04;</> : <>&#x17DB;</>
  const decimal = currency === 'USD' ? 2 : 0
  return <span>{symbol}{value.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span> 
}

export const dateFormat = (date) => {
  const localDate = new Date(date).toDateString()
  return localDate
}

export const inputDateFormat = (d) => {
  let date = new Date(d)
  let dd: any = date.getDate()
  let mm: any = date.getMonth()+1
  let yyyy = date.getFullYear()
  if(dd<10){dd='0'+dd} 
  if(mm<10){mm='0'+mm}
  return d = yyyy+'-'+mm+'-'+dd
}


