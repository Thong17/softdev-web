import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import categoryReducer from 'modules/organize/category/redux'
import brandReducer from 'modules/organize/brand/redux'
import productReducer from 'modules/organize/product/redux'
import storeReducer from 'modules/organize/store/redux'
import stockReducer from 'modules/sale/stock/redux'
import promotionReducer from 'modules/sale/promotion/redux'
import transactionReducer from 'modules/report/transaction/redux'
import queueReducer from 'modules/function/queue/redux'
import roleReducer from 'modules/admin/role/redux'
import userReducer from 'modules/admin/user/redux'
import reservationReducer from 'modules/sale/reservation/redux'
import paymentReducer from 'modules/report/payment/redux'
import loanReducer from 'modules/sale/payment/redux'
import sharedReducer from 'shared/redux'

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    brand: brandReducer,
    product: productReducer,
    store: storeReducer,
    stock: stockReducer,
    promotion: promotionReducer,
    transaction: transactionReducer,
    reservation: reservationReducer,
    payment: paymentReducer,
    loan: loanReducer,
    role: roleReducer,
    queue: queueReducer,
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
