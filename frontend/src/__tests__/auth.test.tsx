import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import ProtectedRoute from '../components/ProtectedRoute';

describe('Authentication Tests', () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  it('should redirect to signin when not authenticated', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    // Wait for the loading state to resolve
    await waitFor(() => {
      expect(window.location.pathname).toBe('/signin');
    });
  });

  it('should show protected content when authenticated', async () => {
    // Dispatch authentication action
    store.dispatch({
      type: 'auth/setAuth',
      payload: {
        isAuthenticated: true,
        user: { id: '1', email: 'test@test.com' },
        token: 'test-token',
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );

    // Wait for the loading state to resolve and content to appear
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
