import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { IRoleBody, initialState } from './constant'

export const create = createAsyncThunk(
  'role/create',
  async (body: IRoleBody) => {
    const response = await Axios({
      method: 'POST',
      url: '/admin/role/create',
      body: body,
    })
    return response?.data
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
      .addCase(create.pending, (state) => {
        state.create.status = 'LOADING'
      })
      .addCase(create.rejected, (state) => {
        state.create.status = 'FAILED'
      })
      .addCase(create.fulfilled, (state, action) => {
        state.create.status = 'SUCCESS'
        state.create.data = action.payload.data
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

export const createRole = (state: RootState) => state.role.create
export const selectPrivilege = (state: RootState) => state.role.privilege
export const selectPreRole = (state: RootState) => state.role.preRole


export default roleSlice.reducer
