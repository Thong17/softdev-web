import Axios from 'constants/functions/Axios'

export const getReportListSale = async ({ query }: { query?: URLSearchParams }) => {
  const response = await Axios({
    method: 'GET',
    url: '/report/listSale',
    params: query
  })
  return response?.data
}

export const getReportSale = async ({ query }: { query?: URLSearchParams }) => {
  const response = await Axios({
    method: 'GET',
    url: '/report/totalSale',
    params: query
  })
  return response?.data
}

export const getReportTopProduct = async ({ query }: { query?: URLSearchParams }) => {
  const response = await Axios({
    method: 'GET',
    url: '/report/topProduct',
    params: query
  })
  return response?.data
}

export const getReportTopStaff = async ({ query }: { query?: URLSearchParams }) => {
  const response = await Axios({
    method: 'GET',
    url: '/report/topStaff',
    params: query
  })
  return response?.data
}

export const getReportListProduct = async ({ query }: { query?: URLSearchParams }) => {
  const response = await Axios({
    method: 'GET',
    url: '/report/listProduct',
    params: query
  })
  return response?.data
}

export const getReportListStaff = async ({ query }: { query?: URLSearchParams }) => {
  const response = await Axios({
    method: 'GET',
    url: '/report/listStaff',
    params: query
  })
  return response?.data
}
