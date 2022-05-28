import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../modules/counter/counterSlice';
import categoryReducer from 'modules/store/category/redux'
import roleReducer from 'modules/admin/role/redux'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    category: categoryReducer,
    role: roleReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
