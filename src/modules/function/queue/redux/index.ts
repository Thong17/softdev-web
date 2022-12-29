import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListQueue = createAsyncThunk(
  'queue/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/function/queue',
      params: query
    })
    return response?.data
  }
)

export const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Queue
      .addCase(getListQueue.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListQueue.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListQueue.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })
  },
})

export const selectListQueue = (state: RootState) => state.queue.list

export default queueSlice.reducer
