import { sha256 } from 'js-sha256'
import { IToken } from 'contexts/auth/interface'
import jwtDecode from 'jwt-decode'
import { StructureStatusType } from 'shared/interface'

export const generateHash = async (
  ts: string,
  token: string = '',
  data?: object
) => {
  const str =
    JSON.stringify(data) + process.env.REACT_APP_HASH_SECRET + ts + token
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
  return (
    <span>
      {symbol}
      {value.toFixed(decimal).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
    </span>
  )
}

export const dateFormat = (date: any = null) => {
  if (!date) return new Date().toDateString()

  const localDate = new Date(date).toDateString()
  return localDate
}

export const timeFormat = (date) => {
  if (!date) return new Date().toLocaleTimeString()

  const localDate = new Date(date).toLocaleTimeString()
  return localDate
}

export const dateFullYear = (date = null) => {
  if (!date) return new Date().getFullYear()

  const year = new Date(date).getFullYear()
  return year
}

export const formatAttendanceDate = (dayString) => {
  const today = new Date()
  const year = today.getFullYear().toString()
  let month = (today.getMonth() + 1).toString()

  if (month.length === 1) {
    month = '0' + month
  }

  return dayString.replace('YEAR', year).replace('MONTH', month)
}

export const inputDateFormat = (d) => {
  if (d === '') return d

  let date = new Date(d)
  let dd: any = date.getDate()
  let mm: any = date.getMonth() + 1
  let yyyy = date.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return (d = yyyy + '-' + mm + '-' + dd)
}

export const capitalizeText = (text) => {
  if (!text) return '...'
  return text?.charAt(0).toUpperCase() + text?.slice(1)
}

export const calculateTotalScore = (scores, subject = null) => {
  let total = 0
  if (subject) {
    scores?.forEach((score) => {
      if (score.subject === subject) total += score.score
    })
    return total
  } else {
    scores?.forEach((score) => {
      total += score.score
    })
    return total
  }
}

export const calculateAverageScore = (scores, number) => {
  let total = 0
  scores?.forEach((score) => {
    total += score.score
  })

  if (total === 0) return '0.00'
  return (total / number).toFixed(2)
}

export const calculatePercentage = (value, limit) => {
  return value / limit * 100 || 0
}

export const calculateGraduateResult = (scores, subjects) => {
  let totalScore = 0
  let passScore = 0
  let fullScore = 0

  scores?.forEach((score) => {
    totalScore += score.score
  })

  subjects?.forEach((subject) => {
    passScore += subject.passScore
    fullScore += subject.fullScore
  })

  const totalAverage = totalScore / subjects?.length
  const passAverage = passScore / subjects?.length
  const fullAverage = fullScore / subjects?.length

  const gradeF = passAverage
  const gradeE = passAverage + (fullAverage - passAverage) / 4
  const gradeD = gradeE + (fullAverage - passAverage) / 4
  const gradeC = gradeD + (fullAverage - passAverage) / 4
  const gradeB = gradeD + (fullAverage - passAverage) / 3
  const gradeA = fullAverage

  switch (true) {
    case totalAverage < gradeF:
      return 'F'
    case totalAverage < gradeE:
      return 'E'
    case totalAverage < gradeD:
      return 'D'
    case totalAverage < gradeC:
      return 'C'
    case totalAverage < gradeB:
      return 'B'
    case totalAverage < gradeA:
      return 'A'
  }
}

export const generateColor = () => {
  let letters = '456789AB'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 8)]
  }
  return color
}

export const generateId = () => {
  let letters = '1234567890ABCDEFGHIJK'
  let id = ''
  for (let i = 0; i < 10; i++) {
    id += letters[Math.floor(Math.random() * 8)]
  }
  return id
}

export const statusReservation = (status: StructureStatusType) => {
  switch (status) {
    case 'reserved':
      return 'warning'
    case 'occupied':
      return 'error'
    default:
      return 'info'
  }
}

export const checkArrayValue = (array, value) => {
  const result = array.every(element => {
    if (element === value) return true
    return false
  })
  return result
}

export const checkArraySequence = (array, increment) => {
  if (array.length < 2) return false

  let result = true

  array.sort().forEach((element, index) => {
    let nextElement = array[index+1]
    if (!nextElement || !result) return
    if (nextElement !== element + increment) result = false
  })
  return result
}
