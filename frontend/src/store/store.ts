import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import aiReducer from './slices/aiSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import fileGenerationReducer from './slices/fileGenerationSlice';
import projectGenerationReducer from './slices/projectGenerationSlice';
import { initializeWebSocket } from '../services/wsInstance';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    ai: aiReducer,
    auth: authReducer,
    ui: uiReducer,
    fileGeneration: fileGenerationReducer,
    projectGeneration: projectGenerationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Initialize WebSocket service with store
initializeWebSocket(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
