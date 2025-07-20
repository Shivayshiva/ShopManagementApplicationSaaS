// lib/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'

import counterReducer from './features/counter/counterSlice'
import invoiceReducer from './features/invoiceSlice'
import customerReducer from './features/customerSlice'

// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default 
  : createNoopStorage()

const rootReducer = combineReducers({
  counter: counterReducer,
  invoice: invoiceReducer,
  customer: customerReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['invoice', 'customer'], // Only persist these reducers
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
