import { configureStore } from '@reduxjs/toolkit';
import aiReducer from './slices/aiSlice';
import flowReducer from './slices/flowSlice';

export const store = configureStore({
  reducer: {
    ai: aiReducer,
    flow: flowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
