import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from './Dashboard';
import authReducer from '../features/auth/authSlice';

describe('Dashboard', () => {
  const renderWithRedux = (
    component: React.ReactNode,
    { initialState = {} } = {}
  ) => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: initialState,
    });

    return render(<Provider store={store}>{component}</Provider>);
  };

  it('renders welcome message without user email when not logged in', () => {
    renderWithRedux(<Dashboard />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('renders welcome message with user email when logged in', () => {
    const testEmail = 'test@example.com';
    renderWithRedux(<Dashboard />, {
      initialState: {
        auth: {
          token: 'test-token',
          isAuthenticated: true,
          loading: false,
          error: null,
          user: { email: testEmail },
        },
      },
    });
    expect(screen.getByText(`Welcome, ${testEmail}`)).toBeInTheDocument();
  });

  it('renders dashboard stats and activity sections', () => {
    renderWithRedux(<Dashboard />);
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});
