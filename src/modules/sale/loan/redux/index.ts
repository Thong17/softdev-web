import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListLoan = createAsyncThunk(
  'loan/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/sale/loan',
      params: query
    })
    return response?.data
  }
)

export const getListRequestLoan = createAsyncThunk(
  'loan/requestList',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/sale/loan/listRequest',
      params: query
    })
    return response?.data
  }
)

export const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Loan
      .addCase(getListLoan.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListLoan.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListLoan.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Request List Loan
      .addCase(getListRequestLoan.pending, (state) => {
        state.requestList.status = 'LOADING'
      })
      .addCase(getListRequestLoan.rejected, (state) => {
        state.requestList.status = 'FAILED'
      })
      .addCase(getListRequestLoan.fulfilled, (state, action) => {
        state.requestList.status = 'SUCCESS'
        state.requestList.data = action.payload.data
      })
  },
})

export const selectListLoan = (state: RootState) => state.loan.list
export const selectListRequestLoan = (state: RootState) => state.loan.requestList

export default loanSlice.reducer
