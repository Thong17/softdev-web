import { sha256 } from 'js-sha256'
import { IToken } from 'contexts/auth/interface'
import jwtDecode from 'jwt-decode'

export const generateHash = async (
  data: object,
  ts: string,
  token: string = ''
) => {
  const str =
    JSON.stringify(data) +
    '283022c0ac08af46e0587d6a571ed433a9eb4b1f82efbd56563d3cce00b0c486' +
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
