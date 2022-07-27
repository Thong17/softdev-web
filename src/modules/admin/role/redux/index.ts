import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListRole = createAsyncThunk(
  'role/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/admin/role',
      params: query
    })
    return response?.data
  }
)

export const getRole = createAsyncThunk(
  'role/detail',
  async ({id, query, fields}: { id: string, query: Object, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/admin/role/detail/${id}`
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Role
      .addCase(getListRole.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListRole.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListRole.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail Role
      .addCase(getRole.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getRole.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectRole = (state: RootState) => state.role.detail
export const selectListRole = (state: RootState) => state.role.list

export default roleSlice.reducer
