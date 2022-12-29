import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getInfoProduct = createAsyncThunk(
  'infoProduct/get',
  async (id: string) => {
    const response = await Axios({
      method: 'GET',
      url: `/shared/product/info/${id}`
    })
    return response?.data
  }
)

export const getStructureCapacity = createAsyncThunk(
  'structure/capacity',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: `/shared/structure/capacity`
    })
    return response?.data
  }
)

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

export const getListCodeProduct = createAsyncThunk(
  'listCodeProduct/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/product/listCode'
    })
    return response?.data
  }
)

export const getListBrand = createAsyncThunk(
  'listBrand/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/brand/list'
    })
    return response?.data
  }
)

export const getListCategory = createAsyncThunk(
  'listCategory/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/category/list'
    })
    return response?.data
  }
)

export const getListPresetCash = createAsyncThunk(
  'listPresetCash/get',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/preset/cash/list'
    })
    return response?.data
  }
)

export const getListProduct = createAsyncThunk(
  'listProduct/get',
  async (query?: URLSearchParams) => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/product/list',
      params: query
    })
    return response?.data
  }
)

export const getListStructure = createAsyncThunk(
  'listStructure/get',
  async (query?: URLSearchParams) => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/structure/list',
      params: query
    })
    return response?.data
  }
)

export const getListCustomer = createAsyncThunk(
  'listCustomer/get',
  async (query?: URLSearchParams) => {
    const response = await Axios({
      method: 'GET',
      url: '/shared/customer/list',
      params: query
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

export const getQueueDashboard = createAsyncThunk(
  'dashboard/queue',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/queue'
    })
    return response?.data
  }
)

export const getOrganizeDashboard = createAsyncThunk(
  'dashboard/organize',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/organize'
    })
    return response?.data
  }
)

export const getOperationDashboard = createAsyncThunk(
  'dashboard/operation',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/dashboard/operation'
    })
    return response?.data
  }
)

export const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    clearInfoProduct(state) {
      state.infoProduct.data = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get List Role from API
      .addCase(getInfoProduct.pending, (state) => {
        state.infoProduct.status = 'LOADING'
      })
      .addCase(getInfoProduct.rejected, (state) => {
        state.infoProduct.status = 'FAILED'
      })
      .addCase(getInfoProduct.fulfilled, (state, action) => {
        state.infoProduct.status = 'SUCCESS'
        state.infoProduct.data = action.payload.data
      })

      // Get Structure Capacity
      .addCase(getStructureCapacity.pending, (state) => {
        state.capacityStructure.status = 'LOADING'
      })
      .addCase(getStructureCapacity.rejected, (state) => {
        state.capacityStructure.status = 'FAILED'
      })
      .addCase(getStructureCapacity.fulfilled, (state, action) => {
        state.capacityStructure.status = 'SUCCESS'
        state.capacityStructure.data = action.payload.data
      })
      
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

      // Get List Brand from API
      .addCase(getListBrand.pending, (state) => {
        state.listBrand.status = 'LOADING'
      })
      .addCase(getListBrand.rejected, (state) => {
        state.listBrand.status = 'FAILED'
      })
      .addCase(getListBrand.fulfilled, (state, action) => {
        state.listBrand.status = 'SUCCESS'
        state.listBrand.data = action.payload.data
      })

      // Get List Code Product from API
      .addCase(getListCodeProduct.pending, (state) => {
        state.listCodeProduct.status = 'LOADING'
      })
      .addCase(getListCodeProduct.rejected, (state) => {
        state.listCodeProduct.status = 'FAILED'
      })
      .addCase(getListCodeProduct.fulfilled, (state, action) => {
        state.listCodeProduct.status = 'SUCCESS'
        state.listCodeProduct.data = action.payload.data
      })

      // Get List Category from API
      .addCase(getListCategory.pending, (state) => {
        state.listCategory.status = 'LOADING'
      })
      .addCase(getListCategory.rejected, (state) => {
        state.listCategory.status = 'FAILED'
      })
      .addCase(getListCategory.fulfilled, (state, action) => {
        state.listCategory.status = 'SUCCESS'
        state.listCategory.data = action.payload.data
      })

      // Get List Category from API
      .addCase(getListPresetCash.pending, (state) => {
        state.listPresetCash.status = 'LOADING'
      })
      .addCase(getListPresetCash.rejected, (state) => {
        state.listPresetCash.status = 'FAILED'
      })
      .addCase(getListPresetCash.fulfilled, (state, action) => {
        state.listPresetCash.status = 'SUCCESS'
        state.listPresetCash.data = action.payload.data
      })

      // Get List Structure from API
      .addCase(getListStructure.pending, (state) => {
        state.listStructure.status = 'LOADING'
      })
      .addCase(getListStructure.rejected, (state) => {
        state.listStructure.status = 'FAILED'
      })
      .addCase(getListStructure.fulfilled, (state, action) => {
        state.listStructure.status = 'SUCCESS'
        state.listStructure.data = action.payload.data
      })

      // Get List Product from API
      .addCase(getListProduct.pending, (state) => {
        state.listProduct.status = 'LOADING'
      })
      .addCase(getListProduct.rejected, (state) => {
        state.listProduct.status = 'FAILED'
      })
      .addCase(getListProduct.fulfilled, (state, action) => {
        state.listProduct.status = 'SUCCESS'
        state.listProduct.data = action.payload.data
        state.listProduct.count = action.payload.length
        state.listProduct.hasMore = action.payload.hasMore
      })

      // Get List Customer from API
      .addCase(getListCustomer.pending, (state) => {
        state.listCustomer.status = 'LOADING'
      })
      .addCase(getListCustomer.rejected, (state) => {
        state.listCustomer.status = 'FAILED'
      })
      .addCase(getListCustomer.fulfilled, (state, action) => {
        state.listCustomer.status = 'SUCCESS'
        state.listCustomer.data = action.payload.data
        state.listCustomer.count = action.payload.length
        state.listCustomer.hasMore = action.payload.hasMore
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

      // Get Organize Dashboard from API
      .addCase(getOrganizeDashboard.pending, (state) => {
        state.organizeDashboard.status = 'LOADING'
      })
      .addCase(getOrganizeDashboard.rejected, (state) => {
        state.organizeDashboard.status = 'FAILED'
      })
      .addCase(getOrganizeDashboard.fulfilled, (state, action) => {
        state.organizeDashboard.status = 'SUCCESS'
        state.organizeDashboard.data = action.payload.data
      })

      // Get Operation Dashboard from API
      .addCase(getOperationDashboard.pending, (state) => {
        state.operationDashboard.status = 'LOADING'
      })
      .addCase(getOperationDashboard.rejected, (state) => {
        state.operationDashboard.status = 'FAILED'
      })
      .addCase(getOperationDashboard.fulfilled, (state, action) => {
        state.operationDashboard.status = 'SUCCESS'
        state.operationDashboard.data = action.payload.data
      })
  },
})

export const selectInfoProduct = (state: RootState) => state.shared.infoProduct
export const selectStructureCapacity = (state: RootState) => state.shared.capacityStructure
export const selectListCodeProduct = (state: RootState) => state.shared.listCodeProduct
export const selectListRole = (state: RootState) => state.shared.listRole
export const selectListBrand = (state: RootState) => state.shared.listBrand
export const selectListCategory = (state: RootState) => state.shared.listCategory
export const selectListStructure = (state: RootState) => state.shared.listStructure
export const selectListPresetCash = (state: RootState) => state.shared.listPresetCash
export const selectListProduct = (state: RootState) => state.shared.listProduct
export const selectListCustomer = (state: RootState) => state.shared.listCustomer
export const selectPrivilege = (state: RootState) => state.shared.privilege
export const selectPreRole = (state: RootState) => state.shared.preRole
export const selectAdminDashboard = (state: RootState) => state.shared.adminDashboard
export const selectOrganizeDashboard = (state: RootState) => state.shared.organizeDashboard
export const selectOperationDashboard = (state: RootState) => state.shared.operationDashboard

export const { clearInfoProduct } = sharedSlice.actions

export default sharedSlice.reducer
