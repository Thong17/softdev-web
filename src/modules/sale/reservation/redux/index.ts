import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from 'app/store'
import Axios from 'constants/functions/Axios'
import { initialState } from './constant'

export const getListReservation = createAsyncThunk(
  'reservation/list',
  async () => {
    const response = await Axios({
      method: 'GET',
      url: '/sale/reservation',
    })
    return response?.data
  }
)

export const getDetailReservation = async ({ id }: any) => {
  const response = await Axios({
    method: 'GET',
    url: `/sale/reservation/detail/${id}`,
  })
  return response?.data
}

export const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List reservation
      .addCase(getListReservation.pending, (state) => {
        state.list.status = 'LOADING'
      })
      .addCase(getListReservation.rejected, (state) => {
        state.list.status = 'FAILED'
      })
      .addCase(getListReservation.fulfilled, (state, action) => {
        state.list.status = 'SUCCESS'
        state.list.data = action.payload.data
      })
  },
})

export const selectListReservation = (state: RootState) => state.reservation.list

export default reservationSlice.reducer
