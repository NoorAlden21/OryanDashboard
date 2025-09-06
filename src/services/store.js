// src/services/store.js
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice"; // <- the base api you showed

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // keep your other reducers here (students, teachers, etc.)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
