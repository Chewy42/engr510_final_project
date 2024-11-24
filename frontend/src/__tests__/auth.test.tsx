import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginSuccess, logout } from '../store/slices/authSlice';
import ProtectedRoute from '../components/ProtectedRoute';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const TestComponent = () => <div>Protected Content</div>;

describe('Authentication Tests', () => {
  it('should redirect to signin when not authenticated', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );

    expect(window.location.pathname).toBe('/signin');
  });

  it('should show protected content when authenticated', () => {
    mockStore.dispatch(
      loginSuccess({
        email: 'test@example.com',
        uid: '123',
      })
    );

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should handle logout correctly', () => {
    mockStore.dispatch(logout());
    const state = mockStore.getState();
    
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBeNull();
  });
});
