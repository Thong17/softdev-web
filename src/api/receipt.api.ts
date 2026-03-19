import axios from "axios"

export const networkPrinting = () => {
  return axios.post(`${process.env.REACT_APP_DIRECT_PRINTING_URL}/print`)
}
