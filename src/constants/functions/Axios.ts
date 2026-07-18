import axios, { AxiosResponse } from 'axios'
import { generateHash } from 'utils'
import { IAxiosProps } from 'constants/interfaces/Axios'

export const Axios = async ({method, url, body, params, headers}: IAxiosProps): Promise<AxiosResponse<any, any>> => {
  const token = window.localStorage.getItem('x-access-token') || ''
  const companyId = window.localStorage.getItem('x-company-id') || ''
  const storeId = window.localStorage.getItem('x-store-id') || ''
  const ts = Date.now().toString()
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const payload = method !== 'GET' && method !== 'DELETE' && body && typeof body === 'object' && !isFormData
    ? {
        ...(body as Record<string, any>),
        ...(companyId ? { company: (body as Record<string, any>)?.company || companyId } : {}),
        ...(storeId ? { store: (body as Record<string, any>)?.store || storeId } : {}),
      }
    : body
  const hash = await generateHash(ts, token, payload)
  const API_HOST = process.env.REACT_APP_API_URL

  const response = await axios({
    method,
    url: `${API_HOST}${url}`,
    data: payload,
    headers: {
      ...headers,
      'x-company-id': headers?.['x-company-id'] || companyId,
      'x-store-id': headers?.['x-store-id'] || storeId,
      'x-access-hash': hash,
      'x-access-ts': ts,
      'x-access-token': token || '',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*'
    },
    params: params
  })
  return response
}

export default Axios
