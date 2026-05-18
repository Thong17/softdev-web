import axios from "axios"

export const directPrinting = (payload: any, type: 'USB' | 'NETWORK' = 'USB', printer: 'invoice58mm' | 'invoice80mm' | 'thermal' = 'invoice58mm') => {
  return axios.post(`${process.env.REACT_APP_DIRECT_PRINTING_URL}/print`, { ...payload, type, printer })
}
