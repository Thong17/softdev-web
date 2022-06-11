import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListProduct = createAsyncThunk(
  'product/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/store/product',
      params: query
    })
    return response?.data
  }
)

export const getDetailProduct = createAsyncThunk(
  'product/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields?: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/store/product/detail/${id}`,
      params: query
    })
    let data = {}
    fields 
      ? fields?.forEach((field) => {
        data[field] = response?.data?.data?.[field]
      })
      : data = response?.data?.data
    
    return { ...response?.data, data }
  }
)

export const getProduct = createAsyncThunk(
  'product/single',
  async ({id, query}: { id: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/store/product/detail/${id}`,
      params: query
    })
    
    return response?.data
  }
)

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List product
      .addCase(getListProduct.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListProduct.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListProduct.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })

      // Detail product
      .addCase(getDetailProduct.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getDetailProduct.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getDetailProduct.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })

      // Get product
      .addCase(getProduct.pending, (state) => {
        state.single.status = 'LOADING'
      })
      .addCase(getProduct.rejected, (state) => {
        state.single.status = 'FAILED'
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.single.status = 'SUCCESS'
        state.single.data = action.payload.data
      })
  },
})

export const selectProduct = (state: RootState) => state.product.single
export const selectListProduct = (state: RootState) => state.product.list
export const selectDetailProduct = (state: RootState) => state.product.detail

export default productSlice.reducer
