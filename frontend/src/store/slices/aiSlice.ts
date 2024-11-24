import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

interface AIState {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  wsConnected: boolean;
}

const initialState: AIState = {
  messages: [],
  isProcessing: false,
  error: null,
  wsConnected: false,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setWsConnected: (state, action: PayloadAction<boolean>) => {
      state.wsConnected = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  setProcessing,
  setError,
  setWsConnected,
  clearMessages,
} = aiSlice.actions;

export default aiSlice.reducer;
