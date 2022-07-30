import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListCategory = createAsyncThunk(
  'category/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/category',
      params: query
    })
    return response?.data
  }
)

export const getCategory = createAsyncThunk(
  'category/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/category/detail/${id}`,
      params: query
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List Category
      .addCase(getListCategory.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListCategory.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListCategory.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail Category
      .addCase(getCategory.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getCategory.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectCategory = (state: RootState) => state.category.detail
export const selectListCategory = (state: RootState) => state.category.list

export default categorySlice.reducer
