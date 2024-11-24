import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import aiReducer from './slices/aiSlice';
import flowReducer from './slices/flowSlice';
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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
