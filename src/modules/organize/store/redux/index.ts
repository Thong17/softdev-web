import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListStore = createAsyncThunk(
  'store/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/store',
      params: query
    })
    return response?.data
  }
)

export const getStore = createAsyncThunk(
  'store/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/organize/detail/${id}`,
      params: query
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List store
      .addCase(getListStore.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListStore.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListStore.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail store
      .addCase(getStore.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getStore.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getStore.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectStore = (state: RootState) => state.store.detail
export const selectListStore = (state: RootState) => state.store.list

export default storeSlice.reducer
