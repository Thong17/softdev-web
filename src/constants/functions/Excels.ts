import Axios from './Axios'

export const ImportExcel = (endpoint, excel, fields) => {
  const formData = new FormData()
  formData.append('excel', excel)
  formData.append('fields', fields)
  return Axios({
    method: 'POST',
    url: endpoint,
    body: formData,
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
}

