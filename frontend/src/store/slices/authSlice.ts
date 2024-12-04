import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | undefined;
  user: { email: string } | null;
  initialized: boolean;
}

// Helper functions for token management
const loadToken = () => {
  // First try localStorage, then sessionStorage
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return token;
};

const saveToken = (token: string, rememberMe: boolean = false) => {
  if (rememberMe) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token'); // Clear session storage
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token'); // Clear local storage
  }
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const clearToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

const initialToken = loadToken();
const initialState: AuthState = {
  isAuthenticated: !!initialToken,
  user: null,
  loading: false,
  error: undefined,
  token: initialToken,
  initialized: false,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Initialize auth state by checking token
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const token = loadToken();
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        
        if (!response.data) {
          throw new Error('Invalid user data');
        }
        
        return { token, user: response.data };
      } catch (error) {
        clearToken();
        return rejectWithValue('Invalid token');
      }
    }
    return null;
  }
);

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, credentials);
      const { token } = response.data;
      
      if (!token) {
        throw new Error('No token received');
      }

      // New registrations are always remembered
      saveToken(token, true);
      
      const userResponse = await axios.get(`${API_URL}/auth/me`);
      
      if (!userResponse.data) {
        throw new Error('Invalid user data');
      }

      return { token, user: userResponse.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string; rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token } = response.data;
      
      if (!token) {
        throw new Error('No token received');
      }

      // Save token based on remember me preference
      saveToken(token, credentials.rememberMe);
      
      const userResponse = await axios.get(`${API_URL}/auth/me`);
      
      if (!userResponse.data) {
        throw new Error('Invalid user data');
      }

      return { token, user: userResponse.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

// Refresh token action
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`);
      const { token } = response.data;
      
      if (!token) {
        throw new Error('No token received');
      }

      // Maintain the same storage type as the original token
      const isRemembered = !!localStorage.getItem('token');
      saveToken(token, isRemembered);
      
      return { token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Token refresh failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = undefined;
      clearToken();
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    // Initialize auth
    builder.addCase(initializeAuth.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      }
      state.loading = false;
      state.initialized = true;
    });
    builder.addCase(initializeAuth.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = action.payload as string;
      state.initialized = true;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.loading = false;
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
