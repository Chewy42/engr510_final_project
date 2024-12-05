import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setResponse, setProcessing } from '../store/generativeSlice';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws';

export const useGenerativeComponent = ({ model, provider }) => {
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setLocalResponse] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'stream':
          setLocalResponse(prev => prev + data.data);
          dispatch(setResponse({ id: model, response: response + data.data }));
          break;
        case 'stream_end':
          setIsLoading(false);
          break;
        case 'error':
          setError(data.error);
          setIsLoading(false);
          break;
        default:
          console.log('Received:', data);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error');
      setIsLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [model, dispatch]);

  const generate = useCallback((prompt) => {
    if (!socket) {
      setError('No connection available');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLocalResponse('');
    dispatch(setProcessing(true));

    socket.send(JSON.stringify({
      content: prompt,
      stream: true,
      model,
      provider
    }));
  }, [socket, model, provider, dispatch]);

  return {
    generate,
    response,
    isLoading,
    error,
    isConnected: !!socket
  };
};
