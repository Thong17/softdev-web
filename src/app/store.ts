import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../modules/counter/counterSlice'
import categoryReducer from 'modules/organize/category/redux'
import brandReducer from 'modules/organize/brand/redux'
import productReducer from 'modules/organize/product/redux'
import storeReducer from 'modules/organize/store/redux'
import stockReducer from 'modules/sale/stock/redux'
import promotionReducer from 'modules/sale/promotion/redux'
import roleReducer from 'modules/admin/role/redux'
import userReducer from 'modules/admin/user/redux'
import reservationReducer from 'modules/sale/reservation/redux'
import paymentReducer from 'modules/sale/payment/redux'
import sharedReducer from 'shared/redux'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    category: categoryReducer,
    brand: brandReducer,
    product: productReducer,
    store: storeReducer,
    stock: stockReducer,
    promotion: promotionReducer,
    reservation: reservationReducer,
    payment: paymentReducer,
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
