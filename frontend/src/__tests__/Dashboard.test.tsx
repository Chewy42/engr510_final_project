import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../pages/Dashboard';
import authReducer from '../store/slices/authSlice';
import projectReducer from '../store/slices/projectSlice';
import * as api from '../services/api';

// Mock the API module
jest.mock('../services/api');

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  let store: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock the fetchProjects API call
    (api.fetchProjects as jest.Mock).mockResolvedValue([]);

    store = configureStore({
      reducer: {
        auth: authReducer,
        project: projectReducer,
      },
      preloadedState: {
        auth: {
          user: { email: 'test@example.com' },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
        project: {
          projects: [],
          currentProject: null,
          isLoading: false,
          error: null,
          isProcessing: false,
          showAIAssistant: false,
          nodes: [],
          edges: [],
          isDirty: false,
          prompt: '',
          artifacts: [],
          analyses: [],
          projectName: '',
          projectDescription: '',
          projectId: null
        }
      },
    });
  });

  const renderWithRedux = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders welcome message with user email', async () => {
    renderWithRedux(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    });
  });

  it('displays project statistics', async () => {
    renderWithRedux(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
      expect(screen.getByText('Tasks Due Today')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // Active Projects count
    });
  });

  it('displays projects section', async () => {
    renderWithRedux(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Your Projects')).toBeInTheDocument();
    });
  });

  it('displays new project button', async () => {
    renderWithRedux(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('New Project')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching projects', async () => {
    renderWithRedux(<Dashboard />);
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  it('shows error message when project fetch fails', async () => {
    // Mock API failure
    (api.fetchProjects as jest.Mock).mockRejectedValue(new Error('Failed to fetch projects'));

    renderWithRedux(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch projects/)).toBeInTheDocument();
    });
  });
});
