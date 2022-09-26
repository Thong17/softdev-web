import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListTransfer = createAsyncThunk(
  'store/transfer',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/store/transfer',
    })
    return response?.data
  }
)

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

export const getLayoutStore = createAsyncThunk(
  'store/layout',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/store/layout`,
      params: query
    })
    return response?.data
  }
)

export const getStructuresStore = createAsyncThunk(
  'store/structures',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/store/structure',
      params: query
    })
    return response?.data
  }
)

export const getListFloor = createAsyncThunk(
  'store/floors',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/store/floor',
    })
    return response?.data
  }
)

export const getStore = createAsyncThunk(
  'store/detail',
  async ({id, query, fields}: { id?: string, query?: URLSearchParams, fields: Array<string> }) => {
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
      // List transfer
      .addCase(getListTransfer.pending, (state) => {
        state.listTransfer.status = 'LOADING'
      })
      .addCase(getListTransfer.rejected, (state) => {
        state.listTransfer.status = 'FAILED'
      })
      .addCase(getListTransfer.fulfilled, (state, action) => {
        state.listTransfer.status = 'SUCCESS'
        state.listTransfer.data = action.payload.data
      })

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

      // Layout store
      .addCase(getLayoutStore.pending, (state) => {
        state.layout.status = 'LOADING'
      })
      .addCase(getLayoutStore.rejected, (state) => {
        state.layout.status = 'FAILED'
      })
      .addCase(getLayoutStore.fulfilled, (state, action) => {
        state.layout.status = 'SUCCESS'
        state.layout.data = action.payload.data
      })

      // Structures store
      .addCase(getStructuresStore.pending, (state) => {
        state.structures.status = 'LOADING'
      })
      .addCase(getStructuresStore.rejected, (state) => {
        state.structures.status = 'FAILED'
      })
      .addCase(getStructuresStore.fulfilled, (state, action) => {
        state.structures.status = 'SUCCESS'
        state.structures.data = action.payload.data
      })

      // Floors store
      .addCase(getListFloor.pending, (state) => {
        state.floors.status = 'LOADING'
      })
      .addCase(getListFloor.rejected, (state) => {
        state.floors.status = 'FAILED'
      })
      .addCase(getListFloor.fulfilled, (state, action) => {
        state.floors.status = 'SUCCESS'
        state.floors.data = action.payload.data
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

export const selectListTransfer = (state: RootState) => state.store.listTransfer
export const selectStore = (state: RootState) => state.store.detail
export const selectLayoutStore = (state: RootState) => state.store.layout
export const selectListFloor = (state: RootState) => state.store.floors
export const selectStructuresStore = (state: RootState) => state.store.structures
export const selectInfoStore = (state: RootState) => state.store.store

export default storeSlice.reducer
