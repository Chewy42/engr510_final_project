import { combineReducers } from '@reduxjs/toolkit';
import flowReducer from './slices/flowSlice';
import authReducer from './slices/authSlice';

export const rootReducer = combineReducers({
  flow: flowReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
