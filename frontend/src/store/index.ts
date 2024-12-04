import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import aiReducer from './slices/aiSlice';
import flowReducer from './slices/flowSlice';
import projectReducer from './slices/projectSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import fileGenerationReducer from './slices/fileGenerationSlice';
import projectGenerationReducer from './slices/projectGenerationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    ai: aiReducer,
    flow: flowReducer,
    fileGeneration: fileGenerationReducer,
    projectGeneration: projectGenerationReducer,
    project: projectReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
