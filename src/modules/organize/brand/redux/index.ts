import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListBrand = createAsyncThunk(
  'brand/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/brand',
      params: query
    })
    return response?.data
  }
)

export const getBrand = createAsyncThunk(
  'brand/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/brand/detail/${id}`,
      params: query
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List brand
      .addCase(getListBrand.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListBrand.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListBrand.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail brand
      .addCase(getBrand.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getBrand.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getBrand.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectBrand = (state: RootState) => state.brand.detail
export const selectListBrand = (state: RootState) => state.brand.list

export default brandSlice.reducer
