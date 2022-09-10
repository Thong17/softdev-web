import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getReportSale = createAsyncThunk(
  'report/sale',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/report/sale',
      params: query
    })
    return response?.data
  }
)
export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Sale report
      .addCase(getReportSale.pending, (state) => {
        state.sale.status = 'LOADING'
      })
      .addCase(getReportSale.rejected, (state) => {
        state.sale.status = 'FAILED'
      })
      .addCase(getReportSale.fulfilled, (state, action) => {
        state.sale.status = 'SUCCESS'
        state.sale.data = action.payload.data
        state.sale.count = action.payload.length
      })
  },
})

export const selectReportSale = (state: RootState) => state.report.sale

export default reportSlice.reducer
