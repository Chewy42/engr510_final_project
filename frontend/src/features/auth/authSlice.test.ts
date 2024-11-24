import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, logout } from './authSlice';
import axios from 'axios';
import { RootState } from '../../store/store';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should handle initial state', () => {
    expect((store.getState() as RootState).auth).toEqual({
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      user: null,
    });
  });

  it('should handle successful login', async () => {
    const mockToken = 'test-token';
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';

    mockedAxios.post.mockResolvedValueOnce({
      data: { token: mockToken },
    });

    await store.dispatch(login({ email: mockEmail, password: mockPassword }) as any);

    expect((store.getState() as RootState).auth).toEqual({
      token: mockToken,
      isAuthenticated: true,
      loading: false,
      error: null,
      user: { email: mockEmail },
    });
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    await store.dispatch(login({ email: 'test@example.com', password: 'wrong' }) as any);

    expect((store.getState() as RootState).auth).toEqual({
      token: null,
      isAuthenticated: false,
      loading: false,
      error: errorMessage,
      user: null,
    });
  });

  it('should handle logout', async () => {
    // First login
    localStorage.setItem('token', 'test-token');
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
          user: { email: 'test@example.com' },
        },
      },
    });

    await store.dispatch(logout() as any);

    expect((store.getState() as RootState).auth).toEqual({
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      user: null,
    });
    expect(localStorage.getItem('token')).toBeNull();
  });
});
