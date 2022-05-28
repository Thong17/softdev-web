import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { ICategoryBody, initState } from '../constant'

export interface CategoryState {
  data: ICategoryBody
  status: 'success' | 'loading' | 'failed'
}

const initialState: CategoryState = {
  data: initState,
  status: 'loading',
}

export const createCategory = createAsyncThunk(
  'category/create',
  async (body: ICategoryBody) => {
    const response = await Axios({
      method: 'POST',
      url: '/store/category/create',
      body: body,
    })
    return response?.data
  }
)

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        console.log('loading...');
        
        state.status = 'loading'
      })
      .addCase(createCategory.rejected, (state) => {
        console.log('failed');
        
        state.status = 'failed'
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        console.log('successsssss!');
        
        state.status = 'success'
        state.data = action.payload
      })
  },
})

export const selectCount = (state: RootState) => state.category.data

export default categorySlice.reducer
