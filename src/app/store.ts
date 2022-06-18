import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../modules/counter/counterSlice'
import categoryReducer from 'modules/store/category/redux'
import brandReducer from 'modules/store/brand/redux'
import productReducer from 'modules/store/product/redux'
import stockReducer from 'modules/sale/stock/redux'
import roleReducer from 'modules/admin/role/redux'
import userReducer from 'modules/admin/user/redux'
import sharedReducer from 'shared/redux'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    category: categoryReducer,
    brand: brandReducer,
    product: productReducer,
    stock: stockReducer,
    role: roleReducer,
    user: userReducer,
    shared: sharedReducer,
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
