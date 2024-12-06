import { Store, AnyAction } from '@reduxjs/toolkit';
import { setWsConnected, addMessage, setProcessing, updateTask } from '../store/slices/aiSlice';
import { setIsProcessing } from '../store/slices/projectSlice';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private store: Store<any, AnyAction>;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second delay

  constructor(store: Store<any, AnyAction>) {
    this.store = store;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      this.ws = new WebSocket('ws://localhost:5000/ws');

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.store.dispatch(setWsConnected(true));
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.store.dispatch(setWsConnected(false));
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          switch (data.type) {
            case 'message':
              this.store.dispatch(addMessage(data.payload));
              break;
            case 'processing':
              this.store.dispatch(setProcessing(data.payload));
              this.store.dispatch(setIsProcessing(data.payload));
              break;
            case 'task_update':
              this.store.dispatch(updateTask(data.payload));
              break;
            default:
              console.log('Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      console.log(`Attempting to reconnect (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.reconnectAttempts++;
        this.reconnectDelay *= 2; // Exponential backoff
        this.connect();
      }, this.reconnectDelay);
    } else {
      console.log('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
}

export function createWebSocketService(store: Store<any, AnyAction>): WebSocketService {
  return new WebSocketService(store);
}
