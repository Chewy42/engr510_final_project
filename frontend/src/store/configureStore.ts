import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import aiReducer from './slices/aiSlice';
import flowReducer from './slices/flowSlice';
import fileGenerationReducer from './slices/fileGenerationSlice';
import projectGenerationReducer from './slices/projectGenerationSlice';
import projectReducer from './slices/projectSlice';

export function configureAppStore() {
  return configureStore({
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
}

export type AppStore = ReturnType<typeof configureAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
