import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListPayment = createAsyncThunk(
  'payment/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/sale/payment',
      params: query
    })
    return response?.data
  }
)

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List payment
      .addCase(getListPayment.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListPayment.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListPayment.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })
  },
})

export const selectListPayment = (state: RootState) => state.payment.list

export default paymentSlice.reducer
