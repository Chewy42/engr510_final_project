import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import projectReducer, { generateProjectStructure } from '../store/slices/projectSlice';
import aiReducer, { setAIAssistantVisibility } from '../store/slices/aiSlice';
import NewProject from '../pages/NewProject';
import { MemoryRouter } from 'react-router-dom';

// Mock the generateProjectStructure thunk
jest.mock('../store/slices/projectSlice', () => ({
  ...jest.requireActual('../store/slices/projectSlice'),
  generateProjectStructure: jest.fn(),
}));

// Mock WebSocket service
jest.mock('../services/websocket', () => ({
  WebSocketService: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    sendMessage: jest.fn(),
    onMessage: jest.fn(),
  })),
}));

// Mock wsInstance
jest.mock('../services/wsInstance', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    sendMessage: jest.fn(),
    onMessage: jest.fn(),
  },
}));

describe('NewProject Component', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        project: projectReducer,
        ai: aiReducer,
      },
      preloadedState: {
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
        },
        ai: {
          isAssistantVisible: false,
        }
      }
    });
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          {component}
        </MemoryRouter>
      </Provider>
    );
  };

  it('shows generate button in initial state', () => {
    renderWithProviders(<NewProject />);
    const input = screen.getByPlaceholderText(/Describe your project idea.../i);
    expect(input).toBeInTheDocument();
  });

  it('displays loading state during generation', async () => {
    const mockGenerateProjectStructure = generateProjectStructure as jest.Mock;
    mockGenerateProjectStructure.mockImplementation(() => async (dispatch: any) => {
      dispatch(setAIAssistantVisibility(true));
      await new Promise(resolve => setTimeout(resolve, 100));
      return { success: true };
    });

    renderWithProviders(<NewProject />);

    const input = screen.getByPlaceholderText(/Describe your project idea.../i);
    const submitButton = screen.getByRole('button', { name: /Generate/i });

    fireEvent.change(input, { target: { value: 'Create a React app with TypeScript' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/Generating.../i)).toBeInTheDocument();
    });
  });

  it('handles generation failure', async () => {
    const mockGenerateProjectStructure = generateProjectStructure as jest.Mock;
    mockGenerateProjectStructure.mockImplementation(() => async (dispatch: any) => {
      dispatch(setAIAssistantVisibility(true));
      throw new Error('Failed to generate project structure');
    });

    renderWithProviders(<NewProject />);

    const input = screen.getByPlaceholderText(/Describe your project idea.../i);
    const submitButton = screen.getByRole('button', { name: /Generate/i });

    fireEvent.change(input, { target: { value: 'Create a React app with TypeScript' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it('displays error message when project creation fails', async () => {
    const errorMessage = 'Failed to create project: Server error';
    store.dispatch({ 
      type: 'project/createNewProject/rejected',
      error: { message: errorMessage }
    });

    renderWithProviders(<NewProject />);
    
    const errorElement = await screen.findByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveStyle({ color: 'error' });
  });

  it('handles API error object correctly', async () => {
    const errorObj = {
      code: 'ERR_SERVER',
      statusCode: 500,
      status: 'error'
    };
    
    store.dispatch({ 
      type: 'project/createNewProject/rejected',
      error: errorObj,
      payload: 'Server error occurred'
    });

    renderWithProviders(<NewProject />);
    
    const errorElement = await screen.findByText('Server error occurred');
    expect(errorElement).toBeInTheDocument();
  });

  it('clears error when component unmounts', async () => {
    store.dispatch({ 
      type: 'project/createNewProject/rejected',
      payload: 'Test error'
    });

    const { unmount } = renderWithProviders(<NewProject />);
    
    expect(screen.getByText('Test error')).toBeInTheDocument();
    
    unmount();
    
    expect(store.getState().project.error).toBeNull();
  });
});
