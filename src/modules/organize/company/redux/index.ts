import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListCompany = createAsyncThunk(
  'company/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/company',
      params: query
    })
    return response?.data
  }
)

export const getCompany = createAsyncThunk(
  'company/detail',
  async ({id, query, fields}: { id: string, query?: URLSearchParams, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/company/detail/${id}`,
      params: query
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })

    return { ...response?.data, data }
  }
)

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List company
      .addCase(getListCompany.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListCompany.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListCompany.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail company
      .addCase(getCompany.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getCompany.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectCompany = (state: RootState) => state.company.detail
export const selectListCompany = (state: RootState) => state.company.list

export default companySlice.reducer
