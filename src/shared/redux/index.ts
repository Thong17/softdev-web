import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListRole = createAsyncThunk(
  'listRole/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/role/list'
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

export const getAdminDashboard = createAsyncThunk(
  'dashboard/admin',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/admin'
    })
    return response?.data
  }
)

export const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get List Role from API
      .addCase(getListRole.pending, (state) => {
        state.listRole.status = 'LOADING'
      })
      .addCase(getListRole.rejected, (state) => {
        state.listRole.status = 'FAILED'
      })
      .addCase(getListRole.fulfilled, (state, action) => {
        state.listRole.status = 'SUCCESS'
        state.listRole.data = action.payload.data
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
      
      // Get Admin Dashboard from API
      .addCase(getAdminDashboard.pending, (state) => {
        state.adminDashboard.status = 'LOADING'
      })
      .addCase(getAdminDashboard.rejected, (state) => {
        state.adminDashboard.status = 'FAILED'
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.adminDashboard.status = 'SUCCESS'
        state.adminDashboard.data = action.payload.data
      })
  },
})

export const selectListRole = (state: RootState) => state.shared.listRole
export const selectPrivilege = (state: RootState) => state.shared.privilege
export const selectPreRole = (state: RootState) => state.shared.preRole
export const selectAdminDashboard = (state: RootState) => state.shared.adminDashboard

export default sharedSlice.reducer
