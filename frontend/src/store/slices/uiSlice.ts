import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  currentPage: string;
  theme: 'light' | 'dark';
  showAIAssistant: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
  currentPage: '',
  theme: 'light',
  showAIAssistant: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setAIAssistantVisibility: (state, action: PayloadAction<boolean>) => {
      state.showAIAssistant = action.payload;
    },
    resetAIAssistantVisibility: (state) => {
      state.showAIAssistant = false;
    },
  },
});

export const { 
  toggleSidebar, 
  setCurrentPage, 
  toggleTheme, 
  setAIAssistantVisibility, 
  resetAIAssistantVisibility 
} = uiSlice.actions;

export default uiSlice.reducer;
