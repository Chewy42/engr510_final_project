import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  currentPage: string;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  sidebarOpen: true,
  currentPage: 'dashboard',
  theme: 'light',
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
  },
});

export const { toggleSidebar, setCurrentPage, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
