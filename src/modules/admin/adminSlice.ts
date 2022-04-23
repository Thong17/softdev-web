import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import api from 'axios'

export interface AuthState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  value: 0,
  status: 'idle',
};

export const login = createAsyncThunk(
  'auth/login',
  async (data) => {
    const response = await api.post(
      'http://localhost:3003/auth/login',
      data
    );
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      });
  },
});

export const selectCount = (state: RootState) => state.counter.value;

export default authSlice.reducer;
