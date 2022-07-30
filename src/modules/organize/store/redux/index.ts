import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getInfoStore = createAsyncThunk(
  'store/info',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/store',
    })
    return response?.data
  }
)

export const getStore = createAsyncThunk(
  'store/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/store/detail/${id}`,
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
      // Info store
      .addCase(getInfoStore.pending, (state) => {
        state.store.status = 'LOADING'
      })
      .addCase(getInfoStore.rejected, (state) => {
        state.store.status = 'FAILED'
      })
      .addCase(getInfoStore.fulfilled, (state, action) => {
        state.store.status = 'SUCCESS'
        state.store.data = action.payload.data
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
export const selectInfoStore = (state: RootState) => state.store.store

export default storeSlice.reducer
