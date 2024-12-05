import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isAIAssistantVisible: boolean;
  isSidebarOpen: boolean;
  activeTab: string;
  showAIAssistant: boolean;
  sidebarOpen: boolean;
}

const initialState: UIState = {
  isAIAssistantVisible: false,
  isSidebarOpen: true,
  activeTab: 'dashboard',
  showAIAssistant: false,
  sidebarOpen: true
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAIAssistantVisibility: (state, action: PayloadAction<boolean>) => {
      state.isAIAssistantVisible = action.payload;
      state.showAIAssistant = action.payload;
    },
    resetAIAssistantVisibility: (state) => {
      state.isAIAssistantVisible = false;
      state.showAIAssistant = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    }
  }
});

export const { 
  setAIAssistantVisibility, 
  resetAIAssistantVisibility, 
  toggleSidebar, 
  setActiveTab 
} = uiSlice.actions;

export default uiSlice.reducer;
