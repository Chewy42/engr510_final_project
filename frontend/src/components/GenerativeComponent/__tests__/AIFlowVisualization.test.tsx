import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AIFlowVisualization from '../AIFlowVisualization';
import projectReducer from '../../../store/slices/projectSlice';
import { aiAgentService } from '../../../services/aiAgentService';
import { setCurrentAnalysis, setProcessing, setError } from '../../../store/slices/aiSlice';

// Mock the ReactFlow component and hooks
jest.mock('@xyflow/react', () => ({
  ReactFlow: () => null,
  Background: () => null,
  Controls: () => null,
  ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useNodesState: () => [[], jest.fn(), jest.fn()],
  useEdgesState: () => [[], jest.fn(), jest.fn()],
  addEdge: jest.fn()
}));

// Mock the aiAgentService
jest.mock('../../../services/aiAgentService', () => ({
  aiAgentService: {
    generateProjectPlan: jest.fn()
  }
}));

const mockProject = {
  id: '123',
  name: 'Test Project',
  description: 'A test project',
  methodology: 'agile' as const,
  status: 'active',
  owner_id: '123e4567-e89b-12d3-a456-426614174000',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const renderWithRedux = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      project: projectReducer,
      ai: (state = { currentAnalysis: null, isProcessing: false, error: null }, action) => {
        switch (action.type) {
          case 'setCurrentAnalysis':
            return { ...state, currentAnalysis: action.payload };
          case 'setProcessing':
            return { ...state, isProcessing: action.payload };
          case 'setError':
            return { ...state, error: action.payload };
          default:
            return state;
        }
      }
    },
    preloadedState: {
      project: {
        currentProject: mockProject,
        isProcessing: false,
        error: null,
      },
      ai: {
        currentAnalysis: null,
        isProcessing: false,
        error: null
      }
    },
  });

  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('AIFlowVisualization', () => {
  it('shows generate button in initial state', () => {
    renderWithRedux(<AIFlowVisualization />);
    expect(screen.getByText(/generate/i)).toBeInTheDocument();
  });

  it('shows loading state while generating', async () => {
    const store = configureStore({
      reducer: {
        project: projectReducer,
        ai: (state = { currentAnalysis: null, isProcessing: false, error: null }, action) => {
          switch (action.type) {
            case 'setCurrentAnalysis':
              return { ...state, currentAnalysis: action.payload };
            case 'setProcessing':
              return { ...state, isProcessing: action.payload };
            case 'setError':
              return { ...state, error: action.payload };
            default:
              return state;
          }
        }
      },
      preloadedState: {
        project: {
          currentProject: mockProject,
          isProcessing: true,
          error: null,
        },
        ai: {
          currentAnalysis: null,
          isProcessing: true,
          error: null
        }
      },
    });

    render(
      <Provider store={store}>
        <AIFlowVisualization />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/generating/i)).toBeInTheDocument();
    });
  });

  it('handles successful project generation', async () => {
    const store = configureStore({
      reducer: {
        project: projectReducer,
        ai: (state = { currentAnalysis: null, isProcessing: false, error: null }, action) => {
          switch (action.type) {
            case 'setCurrentAnalysis':
              return { ...state, currentAnalysis: action.payload };
            case 'setProcessing':
              return { ...state, isProcessing: action.payload };
            case 'setError':
              return { ...state, error: action.payload };
            default:
              return state;
          }
        }
      },
      preloadedState: {
        project: {
          currentProject: {
            ...mockProject,
            analysis: {
              requirements: [],
              architecture: [],
              timeline: [],
              risks: []
            }
          },
          isProcessing: false,
          error: null,
        },
        ai: {
          currentAnalysis: {
            requirements: [],
            architecture: [],
            timeline: [],
            risks: []
          },
          isProcessing: false,
          error: null
        }
      },
    });

    render(
      <Provider store={store}>
        <AIFlowVisualization />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/generate/i)).toBeInTheDocument();
    });
  });

  it('handles generation failure', async () => {
    const store = configureStore({
      reducer: {
        project: projectReducer,
        ai: (state = { currentAnalysis: null, isProcessing: false, error: null }, action) => {
          switch (action.type) {
            case 'setCurrentAnalysis':
              return { ...state, currentAnalysis: action.payload };
            case 'setProcessing':
              return { ...state, isProcessing: action.payload };
            case 'setError':
              return { ...state, error: action.payload };
            default:
              return state;
          }
        }
      },
      preloadedState: {
        project: {
          currentProject: mockProject,
          isProcessing: false,
          error: null,
        },
        ai: {
          currentAnalysis: null,
          isProcessing: false,
          error: 'Failed to generate project'
        }
      },
    });

    render(
      <Provider store={store}>
        <AIFlowVisualization />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to generate project/i)).toBeInTheDocument();
    });
  });
});
