import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./store/authSlice";
import { productSlice } from "./store/productSlice";
import { cartSlice } from "./store/cartSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine all slices
const rootReducer = combineReducers({
  auth: authSlice.reducer,
  product: productSlice.reducer,
  cart: cartSlice.reducer,
});

// Config for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // only cart will be persisted
};

// Wrap reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export persistor
export const persistor = persistStore(store);
