import axios, { AxiosResponse } from 'axios'
import { generateHash } from 'utils'
import { IAxiosProps } from 'constants/interfaces/Axios'
import { getActiveStoreId } from 'contexts/auth/shared'

export const Axios = async ({method, url, body, params, headers}: IAxiosProps): Promise<AxiosResponse<any, any>> => {
  const token = window.localStorage.getItem('x-access-token') || ''
  const ts = Date.now().toString()
  const hash = await generateHash(ts, token, body)
  const API_HOST = process.env.REACT_APP_API_URL

  const response = await axios({
    method,
    url: `${API_HOST}${url}`,
    data: body,
    headers: {
      ...headers,
      'x-access-hash': hash,
      'x-access-ts': ts,
      'x-access-token': token || '',
      'x-store-id': getActiveStoreId() || '',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*'
    },
    params: params
  })
  return response
}

export default Axios
