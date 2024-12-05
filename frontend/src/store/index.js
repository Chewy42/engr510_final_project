import { configureStore } from '@reduxjs/toolkit';
import generativeReducer from './generativeSlice';

export const store = configureStore({
  reducer: {
    generative: generativeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
