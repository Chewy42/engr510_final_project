import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    uid: string;
  } | null;
  loading: boolean;
  error: string | undefined;
  token: string | null;
  initialized: boolean;
}

// Load token from localStorage
const loadToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return token;
  }
  return null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: undefined,
  token: null,
  initialized: false,
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Initialize auth state by checking token
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    const token = loadToken();
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        return { token, user: response.data };
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        throw error;
      }
    }
    return null;
  }
);

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token } = response.data;
      
      // Set token in localStorage and axios headers
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      const userResponse = await axios.get(`${API_URL}/auth/me`);
      
      return { token, user: userResponse.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
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
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
        state.loading = false;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        state.initialized = true;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.error = undefined;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
