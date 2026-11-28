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

// How the Income or Profit card is worked out: each source's totals for the
// card's period, or for fromDate / toDate (ISO date-times) once picked
export const getReportSaleBreakdown = async (params: Record<string, string>) => {
  const response = await Axios({
    method: 'GET',
    url: '/report/totalSale/breakdown',
    params: new URLSearchParams(params),
  })
  return response?.data
}

// One page of a source's sales or payments, newest first
export const getReportSaleBreakdownRows = async (params: Record<string, string>) => {
  const response = await Axios({
    method: 'GET',
    url: '/report/totalSale/breakdown/rows',
    params: new URLSearchParams(params),
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
