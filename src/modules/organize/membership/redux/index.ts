import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListMembership = createAsyncThunk(
  'membership/list',
  async ({ query }: { query?: URLSearchParams }) => {
    const response = await Axios({
      method: 'GET',
      url: '/organize/membership',
      params: query
    })
    return response?.data
  }
)

export const getMembership = createAsyncThunk(
  'membership/detail',
  async ({ id, query, fields }: { id: string, query?: URLSearchParams, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/organize/membership/detail/${id}`,
      params: query
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List membership
      .addCase(getListMembership.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListMembership.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListMembership.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
        state.list.count = action.payload.length
      })

      // Detail membership
      .addCase(getMembership.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getMembership.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getMembership.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })
  },
})

export const selectMembership = (state: RootState) => state.membership.detail
export const selectListMembership = (state: RootState) => state.membership.list

export default membershipSlice.reducer