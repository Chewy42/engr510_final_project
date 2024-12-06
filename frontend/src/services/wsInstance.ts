import { Store } from '@reduxjs/toolkit';
import { createWebSocketService } from './websocket';

let wsService: ReturnType<typeof createWebSocketService> | null = null;

export const initializeWebSocket = (store: Store) => {
  if (!wsService) {
    wsService = createWebSocketService(store);
  }
  return wsService;
};

export const getWebSocketService = () => {
  if (!wsService) {
    throw new Error('WebSocket service not initialized');
  }
  return wsService;
};

export default getWebSocketService;
