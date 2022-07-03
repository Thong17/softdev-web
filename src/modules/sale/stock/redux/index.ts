import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListStock = createAsyncThunk(
  'stock/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/sale/stock/list',
      params: query
    })
    return response?.data
  }
)

export const getProduct = createAsyncThunk(
  'stock/product',
  async ({id, query}: { id: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/sale/stock/product/${id}`,
      params: query
    })
    
    return response?.data
  }
)

export const getStock = createAsyncThunk(
  'stock/detail',
  async ({id, query}: { id: string, query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/sale/stock/detail/${id}`,
      params: query
    })
    
    return response?.data
  }
)

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    createStock(state, action) {
      state.stocks.data = [...state.stocks.data, action.payload]
    },
    updateStock(state, action) {
      state.stocks.data = state.stocks.data.map((stock: any) => {
        if (stock._id === action.payload._id) {
          stock = action.payload
        }
        return stock
      })
    },
    deleteStock(state, action) {
      state.stocks.data = state.stocks.data?.filter((stock: any) => stock._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // List stock
      .addCase(getListStock.pending, (state) => {
        state.stocks.status = 'LOADING'
      })
      .addCase(getListStock.rejected, (state) => {
        state.stocks.status = 'FAILED'
      })
      .addCase(getListStock.fulfilled, (state, action) => {
        state.stocks.status = 'SUCCESS'
        state.stocks.data = action.payload.data
      })

      // Get product
      .addCase(getProduct.pending, (state) => {
        state.product.status = 'LOADING'
      })
      .addCase(getProduct.rejected, (state) => {
        state.product.status = 'FAILED'
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.product.status = 'SUCCESS'
        state.product.data = action.payload.data
      })

      // Get stock
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

export const selectProduct = (state: RootState) => state.stock.product
export const selectStock = (state: RootState) => state.stock.detail
export const selectListStock = (state: RootState) => state.stock.stocks

export const { updateStock, deleteStock, createStock } = stockSlice.actions

export default stockSlice.reducer
