import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  responses: {},
  activeModel: null,
  isProcessing: false,
  error: null
};

export const generativeSlice = createSlice({
  name: 'generative',
  initialState,
  reducers: {
    setResponse: (state, action) => {
      state.responses[action.payload.id] = action.payload.response;
    },
    setActiveModel: (state, action) => {
      state.activeModel = action.payload;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearResponses: (state) => {
      state.responses = {};
    }
  }
});

export const {
  setResponse,
  setActiveModel,
  setProcessing,
  setError,
  clearResponses
} = generativeSlice.actions;

export default generativeSlice.reducer;
