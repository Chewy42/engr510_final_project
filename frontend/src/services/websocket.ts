import { store } from '../store';
import { setWsConnected, addMessage } from '../store/slices/aiSlice';

class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly url: string;

  constructor() {
    this.url = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

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
        store.dispatch(addMessage({
          id: Date.now().toString(),
          content: message.content,
          sender: 'ai',
          timestamp: Date.now(),
        }));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendMessage(content: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ content }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
export default wsService;
