// Global type definitions

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: {
    [key: string]: boolean;
  };
}

export interface LoadingState {
  [key: string]: boolean;
}
