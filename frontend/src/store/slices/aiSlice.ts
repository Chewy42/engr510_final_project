import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgentTask, AnalysisResult } from '../../types/aiTypes';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: number;
}

interface TaskUpdate {
  type: string;
  status: 'pending' | 'started' | 'completed' | 'error';
  message?: string;
  data?: any;
  children?: string[];
}

interface AIState {
  messages: Message[];
  isProcessing: boolean;
  error: string | null;
  wsConnected: boolean;
  taskUpdates: Record<string, TaskUpdate>;
  currentAnalysis: AnalysisResult | null;
  agentTasks: AgentTask[];
}

const initialState: AIState = {
  messages: [],
  isProcessing: false,
  error: null,
  wsConnected: false,
  taskUpdates: {},
  currentAnalysis: null,
  agentTasks: [],
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
    updateTask: (state, action: PayloadAction<TaskUpdate>) => {
      const { type, ...update } = action.payload;
      state.taskUpdates[type] = {
        ...state.taskUpdates[type],
        type,
        ...update,
      };
    },
    clearTasks: (state) => {
      state.taskUpdates = {};
    },
    setCurrentAnalysis: (state, action: PayloadAction<AnalysisResult>) => {
      state.currentAnalysis = action.payload;
    },
    updateAgentTask: (state, action: PayloadAction<AgentTask>) => {
      const index = state.agentTasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.agentTasks[index] = action.payload;
      } else {
        state.agentTasks.push(action.payload);
      }
    },
    clearAnalysis: (state) => {
      state.currentAnalysis = null;
      state.agentTasks = [];
    },
  },
});

export const {
  addMessage,
  setProcessing,
  setError,
  setWsConnected,
  clearMessages,
  updateTask,
  clearTasks,
  setCurrentAnalysis,
  updateAgentTask,
  clearAnalysis,
} = aiSlice.actions;

export default aiSlice.reducer;
