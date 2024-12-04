import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../pages/Dashboard';
import authReducer from '../store/slices/authSlice';

describe('Dashboard Component', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          user: { email: 'test@example.com' },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });
  });

  const renderWithRedux = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders welcome message with user email when logged in', () => {
    renderWithRedux(<Dashboard />);
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  it('displays project statistics', () => {
    renderWithRedux(<Dashboard />);
    
    // Find elements by their text content and role
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('Tasks Due Today')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();

    // Find specific statistic values within their sections
    const activeProjectsSection = screen.getByText('Active Projects').closest('div');
    const tasksDueSection = screen.getByText('Tasks Due Today').closest('div');
    const teamMembersSection = screen.getByText('Team Members').closest('div');

    expect(activeProjectsSection).toBeInTheDocument();
    expect(tasksDueSection).toBeInTheDocument();
    expect(teamMembersSection).toBeInTheDocument();
  });

  it('displays recent activity section', () => {
    renderWithRedux(<Dashboard />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});
