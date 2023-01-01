import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListLoan = createAsyncThunk(
  'loan/list',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/sale/loan',
    })
    return response?.data
  }
)

export const getDetailLoan = createAsyncThunk(
  'loan/detail',
  async ({ id }: any) => {
    const response = await Axios({
      method: 'GET',
      url: `/sale/loan/detail/${id}`,
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
      // List loan
      .addCase(getListLoan.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListLoan.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListLoan.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })

      // Detail loan
      .addCase(getDetailLoan.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getDetailLoan.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getDetailLoan.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectListLoan = (state: RootState) => state.loan.list
export const selectDetailLoan = (state: RootState) => state.loan.detail

export default loanSlice.reducer
