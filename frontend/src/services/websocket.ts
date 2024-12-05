import { Store } from '@reduxjs/toolkit';
import { setWsConnected, addMessage, setProcessing, updateTask } from '../store/slices/aiSlice';
import { setNodes, setEdges } from '../store/slices/projectSlice';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private store: Store | null = null;

  constructor() {
    this.url = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';
  }

  setStore(store: Store) {
    this.store = store;
  }

  private ensureStore(): Store {
    if (!this.store) {
      throw new Error('Store is not initialized');
    }
    return this.store;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);
    const store = this.ensureStore();

    this.ws.onopen = () => {
      store.dispatch(setWsConnected(true));
      console.log('WebSocket connected');
    };

    this.ws.onclose = () => {
      store.dispatch(setWsConnected(false));
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const store = this.ensureStore();
        
        switch (message.type) {
          case 'task_update':
            store.dispatch(updateTask({
              type: message.type,
              status: message.status,
              message: message.message,
              data: message.data,
              children: message.children,
            }));
            
            // Also add a message to the chat
            store.dispatch(addMessage({
              id: Date.now().toString(),
              content: `${message.message || message.type} - ${message.status}`,
              sender: 'system',
              timestamp: Date.now(),
            }));

            // Update nodes and edges if data contains them
            if (message.data?.nodes && message.data?.edges) {
              store.dispatch(setNodes(message.data.nodes));
              store.dispatch(setEdges(message.data.edges));
            }
            break;

          case 'generation_started':
            store.dispatch(addMessage({
              id: Date.now().toString(),
              content: message.message,
              sender: 'system',
              timestamp: Date.now(),
            }));
            store.dispatch(setProcessing(true));
            break;

          case 'generation_complete':
            store.dispatch(addMessage({
              id: Date.now().toString(),
              content: 'Project structure generation complete',
              sender: 'system',
              timestamp: Date.now(),
            }));
            store.dispatch(setProcessing(false));
            break;

          case 'error':
            store.dispatch(addMessage({
              id: Date.now().toString(),
              content: 'Error: ' + message.content,
              sender: 'system',
              timestamp: Date.now(),
            }));
            store.dispatch(setProcessing(false));
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        this.ensureStore().dispatch(setProcessing(false));
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      store.dispatch(setProcessing(false));
    };
  }

  sendMessage(content: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const store = this.ensureStore();
      store.dispatch(setProcessing(true));
      this.ws.send(JSON.stringify({ content }));
    } else {
      console.error('WebSocket is not connected');
      const store = this.ensureStore();
      store.dispatch(addMessage({
        id: Date.now().toString(),
        content: 'Error: WebSocket is not connected',
        sender: 'system',
        timestamp: Date.now(),
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export function createWebSocketService(): WebSocketService {
  return new WebSocketService();
}
