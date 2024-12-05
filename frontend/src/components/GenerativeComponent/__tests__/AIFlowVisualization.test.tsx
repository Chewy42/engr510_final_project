import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AIFlowVisualization from '../AIFlowVisualization';
import projectReducer from '../../../store/slices/projectSlice';

// Mock the ReactFlow component and hooks
const mockSetNodes = jest.fn();
const mockSetEdges = jest.fn();
const mockOnNodesChange = jest.fn();
const mockOnEdgesChange = jest.fn();

jest.mock('@xyflow/react', () => {
  const store = {
    getState: () => ({
      nodes: [],
      edges: [],
      nodeInternals: new Map(),
      selectedNodes: [],
      selectedEdges: []
    }),
    subscribe: () => () => {},
    dispatch: () => {}
  };

  return {
    ReactFlow: ({ nodes, edges }) => (
      <div data-testid="react-flow">
        {nodes?.map(node => (
          <div key={node.id} data-testid={`node-${node.id}`} className="react-flow__node">
            <div>{node.data.label}</div>
            <div>{node.data.description}</div>
            {node.data.priority && (
              <div>Priority: {node.data.priority}</div>
            )}
          </div>
        ))}
      </div>
    ),
    useNodesState: () => [[], mockSetNodes, mockOnNodesChange],
    useEdgesState: () => [[], mockSetEdges, mockOnEdgesChange],
    ReactFlowProvider: ({ children }) => <div>{children}</div>,
    Background: () => null,
    Controls: () => null,
  };
});

// Mock artifacts data
const mockArtifacts = {
  nodes: [
    {
      id: '1',
      type: 'requirement',
      data: { label: 'Requirement 1' },
      position: { x: 0, y: 0 }
    },
    {
      id: '2',
      type: 'architecture',
      data: { label: 'Architecture 1' },
      position: { x: 100, y: 0 }
    }
  ],
  edges: [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'default'
    }
  ]
};

jest.mock('../utils/nodePositioning', () => ({
  calculateNodePositions: jest.fn((nodes: any[], edges: any[]) => {
    return nodes.map((node: any) => ({
      ...node,
      position: { x: 0, y: 0 }
    }));
  })
}));

const mockAgentOrchestrationService = {
  generateArtifacts: jest.fn().mockResolvedValue({
    nodes: [
      {
        id: '1',
        type: 'requirement',
        position: { x: 0, y: 0 },
        data: {
          label: 'Test Node',
          description: 'Test Description',
          priority: 'High'
        }
      }
    ],
    edges: []
  }),
  getArtifacts: jest.fn().mockResolvedValue({
    nodes: [],
    edges: []
  }),
  executeAnalysis: jest.fn().mockResolvedValue({
    nodes: [],
    edges: []
  })
};

const mockProject = {
  project_id: '123',
  name: 'Test Project',
  description: 'Test Description'
};

const store = configureStore({
  reducer: {
    project: projectReducer
  },
  preloadedState: {
    project: {
      currentProject: mockProject,
      projects: [mockProject],
      loading: false,
      error: null
    }
  }
});

const renderAIFlowVisualization = (props = {}) => {
  return render(
    <Provider store={store}>
      <AIFlowVisualization 
        agentOrchestrationService={mockAgentOrchestrationService} 
        {...props} 
      />
    </Provider>
  );
};

describe('AIFlowVisualization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = renderAIFlowVisualization();
    expect(getByTestId('react-flow')).toBeInTheDocument();
  });

  it('handles generate button click', async () => {
    const { getByRole, getByTestId } = renderAIFlowVisualization();
    const generateButton = getByRole('button', { name: /generate/i });

    expect(generateButton).toBeEnabled();
    fireEvent.click(generateButton);
    expect(generateButton).toBeDisabled();
    
    await waitFor(() => {
      expect(mockAgentOrchestrationService.generateArtifacts).toHaveBeenCalledTimes(1);
      expect(generateButton).toHaveTextContent('Generate');
      expect(generateButton).not.toBeDisabled();
    });
  });

  it('displays generated nodes', async () => {
    const { getByRole, getByTestId } = renderAIFlowVisualization();
    const generateButton = getByRole('button', { name: /generate/i });

    await act(async () => {
      fireEvent.click(generateButton);
      await mockAgentOrchestrationService.generateArtifacts();
    });

    await waitFor(() => {
      expect(mockAgentOrchestrationService.generateArtifacts).toHaveBeenCalledTimes(1);
      const node = getByTestId('node-1');
      expect(node).toHaveTextContent('Test Node');
      expect(node).toHaveTextContent('Test Description');
      expect(node).toHaveTextContent('Priority: High');
    });
  });

  it('handles generation failure', async () => {
    mockAgentOrchestrationService.generateArtifacts.mockRejectedValueOnce(new Error('Failed to generate'));
    
    const { getByRole, getByText } = renderAIFlowVisualization();
    const generateButton = getByRole('button', { name: /generate/i });
    
    await act(async () => {
      fireEvent.click(generateButton);
    });

    await waitFor(() => {
      expect(generateButton).not.toBeDisabled();
      expect(getByText('Failed to load artifacts')).toBeInTheDocument();
    });
  });

  it('loads artifacts when project changes', async () => {
    mockAgentOrchestrationService.getArtifacts.mockResolvedValueOnce(mockArtifacts);
    
    const { rerender } = renderAIFlowVisualization();
    
    await waitFor(() => {
      expect(mockAgentOrchestrationService.getArtifacts).toHaveBeenCalledWith('123');
    });

    // Update project and verify artifacts are reloaded
    const newProject = { ...mockProject, project_id: '456' };
    const newStore = configureStore({
      reducer: { project: projectReducer },
      preloadedState: {
        project: {
          currentProject: newProject,
          projects: [newProject],
          loading: false,
          error: null
        }
      }
    });

    rerender(
      <Provider store={newStore}>
        <AIFlowVisualization agentOrchestrationService={mockAgentOrchestrationService} />
      </Provider>
    );

    await waitFor(() => {
      expect(mockAgentOrchestrationService.getArtifacts).toHaveBeenCalledWith('456');
    });
  });

  it('handles artifact loading failure', async () => {
    mockAgentOrchestrationService.getArtifacts.mockRejectedValueOnce(new Error('Failed to load'));
    
    const { getByText } = renderAIFlowVisualization();
    
    await waitFor(() => {
      expect(getByText('Failed to load artifacts')).toBeInTheDocument();
    });
  });

  it('handles empty artifact response', async () => {
    mockAgentOrchestrationService.getArtifacts.mockResolvedValueOnce({
      nodes: [],
      edges: []
    });
    
    renderAIFlowVisualization();
    
    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalledWith([]);
      expect(mockSetEdges).toHaveBeenCalledWith([]);
    });
  });

  it('handles invalid artifact response', async () => {
    mockAgentOrchestrationService.getArtifacts.mockResolvedValueOnce({
      // Missing nodes and edges properties
      invalidProp: true
    });
    
    const { getByText } = renderAIFlowVisualization();
    
    await waitFor(() => {
      expect(getByText('Failed to load artifacts')).toBeInTheDocument();
    });
  });

  it('handles concurrent generate requests', async () => {
    const { getByRole } = renderAIFlowVisualization();
    const generateButton = getByRole('button', { name: /generate/i });

    // Click generate button multiple times rapidly
    fireEvent.click(generateButton);
    fireEvent.click(generateButton);
    fireEvent.click(generateButton);

    await waitFor(() => {
      // Should only call generate once while processing
      expect(mockAgentOrchestrationService.generateArtifacts).toHaveBeenCalledTimes(1);
    });
  });
});
