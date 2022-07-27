import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListUser = createAsyncThunk(
  'user/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/admin/user',
      params: query
    })
    return response?.data
  }
)

export const getUser = createAsyncThunk(
  'user/detail',
  async ({id, query, fields}: { id: string, query: Object, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/admin/user/detail/${id}`
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List User
      .addCase(getListUser.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListUser.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListUser.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail User
      .addCase(getUser.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getUser.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectUser = (state: RootState) => state.user.detail
export const selectListUser = (state: RootState) => state.user.list


export default userSlice.reducer
