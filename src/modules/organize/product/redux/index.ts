import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListProduct = createAsyncThunk(
  'product/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/product',
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
      url: `/organize/product/detail/${id}`,
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
      url: `/organize/product/detail/${id}`,
      params: query
    })
    
    return response?.data
  }
)

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    createOption(state, action) {
      state.single.data.options = [...state.single.data.options, action.payload]
    },
    updateOption(state, action) {
      state.single.data.options = state.single.data.options.map((option) => {
        if (option._id === action.payload._id) {
          option = action.payload
        }
        return option
      })
    },
    deleteOption(state, action) {
      state.single.data.options = state.single.data.options?.filter((property) => property._id !== action.payload)
    },
    createProperty(state, action) {
      state.single.data.properties = [...state.single.data.properties, action.payload]
    },
    updateProperty(state, action) {
      state.single.data.properties = state.single.data.properties.map((property) => {
        if (property._id === action.payload._id) {
          property = action.payload
        }
        return property
      })
    },
    deleteProperty(state, action) {
      state.single.data.properties = state.single.data.properties?.filter((property) => property._id !== action.payload)
    },
    createColor(state, action) {
      state.single.data.colors = [...state.single.data.colors, action.payload]
    },
    updateColor(state, action) {
      state.single.data.colors = state.single.data.colors.map((color) => {
        if (color._id === action.payload._id) {
          color = action.payload
        }
        return color
      })
    },
    deleteColor(state, action) {
      state.single.data.colors = state.single.data.colors?.filter((color) => color._id !== action.payload)
    },
    createCustomerOption(state, action) {
      state.single.data.customers = [...state.single.data.customers, action.payload]
    },
    updateCustomerOption(state, action) {
      state.single.data.customers = state.single.data.customers.map((customer) => {
        if (customer._id === action.payload._id) {
          customer = action.payload
        }
        return customer
      })
    },
    deleteCustomerOption(state, action) {
      state.single.data.customers = state.single.data.customers?.filter((customer) => customer._id !== action.payload)
    }
  },
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
        state.list.count = action.payload.length
        state.list.hasMore = action.payload.hasMore
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
export const { updateOption, deleteOption, createOption, updateProperty, deleteProperty, createProperty, updateColor, deleteColor, createColor, createCustomerOption, updateCustomerOption, deleteCustomerOption } = productSlice.actions

export default productSlice.reducer
