import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import { useAuth } from '../useAuth';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

describe('useAuth hook', () => {
  it('should return auth state', () => {
    const store = createTestStore({
      auth: {
        isAuthenticated: true,
        user: { email: 'test@example.com' },
        token: 'test-token',
        loading: false,
        error: null,
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
  });
});
