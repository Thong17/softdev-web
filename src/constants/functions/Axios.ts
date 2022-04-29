import axios, { AxiosResponse } from 'axios'
import { generateHash } from 'utils'
import { IAxiosProps } from 'constants/interfaces/Axios'

export const Axios = async ({method, url, body}: IAxiosProps): Promise<AxiosResponse<any, any>> => {
  const token = window.localStorage.getItem('x-access-token') || ''
  const ts = Date.now().toString()
  const hash = await generateHash(ts, token, body)

  const response = await axios({
    method,
    url: `http://localhost:3030${url}`,
    data: body,
    headers: {
      'x-access-hash': hash,
      'x-access-ts': ts,
      'x-access-token': token || '',
    },
  })
  return response
}

export default Axios
