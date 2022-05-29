import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListRole = createAsyncThunk(
  'role/list',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/admin/role'
    })
    return response?.data
  }
)

export const getRole = createAsyncThunk(
  'role/detail',
  async ({id, query, fields}: { id: string, query: Object, fields: Array<string> }) => {
    const response = await Axios({
      method: 'GET',
      url: `/admin/role/detail/${id}?${query}`
    })
    let data = {}
    fields.forEach((field) => {
      data[field] = response?.data?.data?.[field]
    })
    
    return { ...response?.data, data }
  }
)

export const getPrivilege = createAsyncThunk(
  'privilege/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/admin/role/privilege'
    })
    return response?.data
  }
)

export const getPreRole = createAsyncThunk(
  'preRole/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/admin/role/preRole'
    })
    return response?.data
  }
)

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Role
      .addCase(getListRole.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListRole.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListRole.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })

      // Detail Role
      .addCase(getRole.pending, (state) => {
        state.detail.status = 'LOADING'
      })
      .addCase(getRole.rejected, (state) => {
        state.detail.status = 'FAILED'
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.detail.status = 'SUCCESS'
        state.detail.data = action.payload.data
      })

      // Get Privilege from API
      .addCase(getPrivilege.pending, (state) => {
        state.privilege.status = 'LOADING'
      })
      .addCase(getPrivilege.rejected, (state) => {
        state.privilege.status = 'FAILED'
      })
      .addCase(getPrivilege.fulfilled, (state, action) => {
        state.privilege.status = 'SUCCESS'
        state.privilege.data = action.payload.data
      })
      
      // Get Pre Role from API
      .addCase(getPreRole.pending, (state) => {
        state.preRole.status = 'LOADING'
      })
      .addCase(getPreRole.rejected, (state) => {
        state.preRole.status = 'FAILED'
      })
      .addCase(getPreRole.fulfilled, (state, action) => {
        state.preRole.status = 'SUCCESS'
        state.preRole.data = action.payload.data
      })
  },
})

export const selectRole = (state: RootState) => state.role.detail
export const selectListRole = (state: RootState) => state.role.list
export const selectPrivilege = (state: RootState) => state.role.privilege
export const selectPreRole = (state: RootState) => state.role.preRole


export default roleSlice.reducer
