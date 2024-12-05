import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './store/slices/projectSlice';
import authReducer from './store/slices/authSlice';
import { ProjectState } from './types/project.types';
import App from './App';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { email: string };
  loading: boolean;
  error: string | undefined;
  token: string | null;
  initialized: boolean;
}

interface RenderOptions {
  preloadedState?: {
    project?: ProjectState;
    auth?: AuthState;
  };
  store?: ReturnType<typeof configureStore>;
}

function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {
      project: {
        // Flow diagram state
        nodes: [],
        edges: [],
        prompt: '',
        
        // Project management state
        projects: [],
        currentProject: null,
        artifacts: [],
        analyses: [],
        
        // Project creation state
        projectName: '',
        projectDescription: '',
        
        // UI state
        isLoading: false,
        isProcessing: false,
        error: null,
        projectId: null,
        isDirty: false
      },
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: undefined,
        token: null,
        initialized: true
      }
    }
  }: RenderOptions = {}
) {
  const store = configureStore({
    reducer: {
      project: projectReducer,
      auth: authReducer
    },
    preloadedState
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper })
  };
}

describe('App Component', () => {
  test('renders app without crashing', async () => {
    renderWithProviders(<App />);
    // Add appropriate assertions based on your app's initial render state
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });
});
