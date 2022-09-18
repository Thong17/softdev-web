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

export const getReportProduct = createAsyncThunk(
  'report/product',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/report/product',
      params: query
    })
    return response?.data
  }
)

export const getReportStaff = createAsyncThunk(
  'report/staff',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/report/staff',
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

      // Product report
      .addCase(getReportProduct.pending, (state) => {
        state.product.status = 'LOADING'
      })
      .addCase(getReportProduct.rejected, (state) => {
        state.product.status = 'FAILED'
      })
      .addCase(getReportProduct.fulfilled, (state, action) => {
        state.product.status = 'SUCCESS'
        state.product.data = action.payload.data
        state.product.count = action.payload.length
      })

      // Staff report
      .addCase(getReportStaff.pending, (state) => {
        state.staff.status = 'LOADING'
      })
      .addCase(getReportStaff.rejected, (state) => {
        state.staff.status = 'FAILED'
      })
      .addCase(getReportStaff.fulfilled, (state, action) => {
        state.staff.status = 'SUCCESS'
        state.staff.data = action.payload.data
        state.staff.count = action.payload.length
      })
  },
})

export const selectReportSale = (state: RootState) => state.report.sale
export const selectReportProduct = (state: RootState) => state.report.product
export const selectReportStaff = (state: RootState) => state.report.staff

export default reportSlice.reducer
