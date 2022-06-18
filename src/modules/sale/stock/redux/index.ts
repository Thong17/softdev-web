import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListStock = createAsyncThunk(
  'product/list/stock',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/store/product/stock',
      params: query
    })
    return response?.data
  }
)

export const getStock = createAsyncThunk(
  'product/stock',
  async ({id, query}: { id: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/store/product/stock/${id}`,
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
      .addCase(getListStock.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListStock.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListStock.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })

      // Get product
      .addCase(getStock.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getStock.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getStock.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectStock = (state: RootState) => state.stock.detail
export const selectListStock = (state: RootState) => state.stock.list

export default productSlice.reducer
