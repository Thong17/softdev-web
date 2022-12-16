import { languages } from 'contexts/language/constant'
import Axios from './Axios'

export const ImportExcel = (endpoint, excel, fields) => {
  const formData = new FormData()
  formData.append('excel', excel)
  formData.append('fields', fields)
  formData.append('languages', JSON.stringify(Object.keys(languages)))
  return Axios({
    method: 'POST',
    url: endpoint,
    body: formData,
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
}

