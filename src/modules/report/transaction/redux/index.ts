import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListTransaction = createAsyncThunk(
  'transaction/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/sale/transaction',
      params: query
    })
    return response?.data
  }
)

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List transaction
      .addCase(getListTransaction.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListTransaction.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListTransaction.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })
  },
})

export const selectListTransaction = (state: RootState) => state.transaction.list

export default transactionSlice.reducer
