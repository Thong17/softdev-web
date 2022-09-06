import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListPayment = createAsyncThunk(
  'payment/list',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/sale/payment',
    })
    return response?.data
  }
)

export const getDetailPayment = createAsyncThunk(
  'payment/detail',
  async ({ id }: any) => {
    const response = await Axios({
      method: 'GET',
      url: `/sale/payment/detail/${id}`,
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
      })

      // Detail payment
      .addCase(getDetailPayment.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getDetailPayment.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getDetailPayment.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectListPayment = (state: RootState) => state.payment.list
export const selectDetailPayment = (state: RootState) => state.payment.detail

export default paymentSlice.reducer
