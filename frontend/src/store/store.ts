import { configureAppStore } from './configureStore';
import { wsService } from '../services/wsInstance';

export const store = configureAppStore();

// Set up websocket service with store after initialization
wsService.setStore(store);

export type { RootState, AppDispatch } from './configureStore';
