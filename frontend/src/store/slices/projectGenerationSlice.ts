import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from 'axios';

export interface Template {
  id: string;
  name: string;
  description: string;
  variables: string[];
}

interface ProjectGenerationState {
  templates: Template[];
  selectedTemplate: Template | null;
  generationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  progress: number;
  currentStep: string;
  error: string | null;
  streamingResponse: string[];
  validationErrors: string[];
  retryCount: number;
  lastAttemptTimestamp: number | null;
}

const initialState: ProjectGenerationState = {
  templates: [
    {
      id: 'web-app',
      name: 'Web Application',
      description: 'Full-stack web application with frontend and backend',
      variables: ['projectType', 'requirements'],
    },
    {
      id: 'api-service',
      name: 'API Service',
      description: 'RESTful API service with database integration',
      variables: ['projectType', 'requirements'],
    },
    // Add more templates as needed
  ],
  selectedTemplate: null,
  generationStatus: 'idle',
  progress: 0,
  currentStep: '',
  error: null,
  streamingResponse: [],
  validationErrors: [],
  retryCount: 0,
  lastAttemptTimestamp: null,
};

const validateProjectInput = (template: string, variables: Record<string, string>) => {
  const errors: string[] = [];
  // Add validation logic here
  return { isValid: errors.length === 0, errors };
};

export const generateProject = createAsyncThunk(
  'projectGeneration/generate',
  async ({ template, variables }: { template: string; variables: Record<string, string> }, { rejectWithValue }) => {
    try {
      // Validate input before making API call
      const validation = validateProjectInput(template, variables);
      if (!validation.isValid) {
        return rejectWithValue({ errors: validation.errors });
      }

      const response = await axios.post('/api/ai/generate', {
        template,
        variables,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          errors: [error.response?.data?.message || 'Network error occurred'],
          isRetryable: error.response?.status ? error.response.status >= 500 : true
        });
      }
      return rejectWithValue({ errors: ['An unexpected error occurred'] });
    }
  }
);

const projectGenerationSlice = createSlice({
  name: 'projectGeneration',
  initialState,
  reducers: {
    selectTemplate: (state, action) => {
      state.selectedTemplate = state.templates.find(t => t.id === action.payload) || null;
    },
    updateProgress: (state, action) => {
      state.progress = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    addStreamingResponse: (state, action) => {
      state.streamingResponse.push(action.payload);
    },
    clearStreamingResponse: (state) => {
      state.streamingResponse = [];
    },
    resetState: (state) => {
      return { ...initialState, templates: state.templates };
    },
    clearErrors: (state) => {
      state.error = null;
      state.validationErrors = [];
    },
    incrementRetry: (state) => {
      state.retryCount += 1;
      state.lastAttemptTimestamp = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateProject.pending, (state) => {
        state.generationStatus = 'loading';
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(generateProject.fulfilled, (state) => {
        state.generationStatus = 'succeeded';
        state.retryCount = 0;
        state.lastAttemptTimestamp = null;
      })
      .addCase(generateProject.rejected, (state, action) => {
        state.generationStatus = 'failed';
        if (action.payload) {
          const payload = action.payload as { errors: string[]; isRetryable?: boolean };
          state.validationErrors = payload.errors;
          state.error = payload.errors.join('. ');
          
          // Only increment retry count for retryable errors
          if (payload.isRetryable) {
            state.retryCount += 1;
            state.lastAttemptTimestamp = Date.now();
          }
        } else {
          state.error = action.error.message || 'Failed to generate project';
        }
      });
  },
});

export const {
  selectTemplate,
  updateProgress,
  setCurrentStep,
  addStreamingResponse,
  clearStreamingResponse,
  resetState,
  clearErrors,
  incrementRetry,
} = projectGenerationSlice.actions;

export const selectProjectGeneration = (state: RootState) => state.projectGeneration as ProjectGenerationState;

export default projectGenerationSlice.reducer;
