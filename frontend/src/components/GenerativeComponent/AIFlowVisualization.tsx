import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  ReactFlowProvider,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { generateProjectStructure } from '../../store/slices/projectSlice';
import { setAIAssistantVisibility } from '../../store/slices/uiSlice';
import { setCurrentAnalysis, setProcessing, setError } from '../../store/slices/aiSlice';
import { RequirementNode, ArchitectureNode, TimelineNode, RiskNode } from './nodes/CustomNodes';
import { agentOrchestrationService } from '../../services/agentOrchestrationService';
import { ProjectArtifact } from '../../db/schema';

const nodeTypes = {
  requirement: RequirementNode,
  architecture: ArchitectureNode,
  timeline: TimelineNode,
  risk: RiskNode,
};

interface CustomNode extends Node {
  type: keyof typeof nodeTypes;
  version?: number;
  status?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

const calculateNodePositions = (artifacts: ProjectArtifact[]) => {
  const VERTICAL_SPACING = 150;
  const HORIZONTAL_SPACING = 300;
  
  const nodes: CustomNode[] = [];
  const edges: Edge[] = [];
  
  // Group artifacts by type
  const artifactsByType = artifacts.reduce((acc, artifact) => {
    if (!acc[artifact.type]) acc[artifact.type] = [];
    acc[artifact.type].push(artifact);
    return acc;
  }, {} as Record<string, ProjectArtifact[]>);

  // Create nodes for each type
  let row = 0;
  Object.entries(artifactsByType).forEach(([type, typeArtifacts]) => {
    typeArtifacts.forEach((artifact, index) => {
      const node: CustomNode = {
        id: artifact.id,
        type: type as keyof typeof nodeTypes,
        position: { x: index * HORIZONTAL_SPACING, y: row * VERTICAL_SPACING },
        data: {
          ...artifact.content,
          version: artifact.version,
          status: artifact.status,
          approvedBy: artifact.approved_by
        }
      };
      nodes.push(node);

      // Create edges based on dependencies
      if (artifact.content.dependencies) {
        artifact.content.dependencies.forEach((depId: string) => {
          edges.push({
            id: `${artifact.id}-${depId}`,
            source: depId,
            target: artifact.id,
            type: 'smoothstep',
            animated: true,
          });
        });
      }
    });
    row++;
  });

  return { nodes, edges };
};

const Flow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject, isProcessing } = useSelector((state: RootState) => state.project);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProject) return;
    
    // Load existing artifacts
    const loadArtifacts = async () => {
      try {
        const artifacts = await agentOrchestrationService.getArtifacts(currentProject.id);
        const { nodes: newNodes, edges: newEdges } = calculateNodePositions(artifacts);
        setNodes(newNodes);
        setEdges(newEdges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artifacts');
      }
    };

    loadArtifacts();
  }, [currentProject, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  );

  const handleGenerate = async () => {
    if (!currentProject) {
      setError('No project selected');
      return;
    }

    try {
      dispatch(setProcessing(true));
      dispatch(setAIAssistantVisibility(true));
      
      // Subscribe to agent events
      agentOrchestrationService.on('agentComplete', (result) => {
        console.log(`Agent ${result.type} completed:`, result);
      });

      agentOrchestrationService.on('error', (err) => {
        setError(err instanceof Error ? err.message : 'An error occurred');
      });

      // Execute analysis
      await agentOrchestrationService.executeAnalysis(currentProject.id);

      // Load updated artifacts
      const artifacts = await agentOrchestrationService.getArtifacts(currentProject.id);
      const { nodes: newNodes, edges: newEdges } = calculateNodePositions(artifacts);
      setNodes(newNodes);
      setEdges(newEdges);

      // Update project store
      dispatch(generateProjectStructure(artifacts));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
      dispatch(setAIAssistantVisibility(false));
    } finally {
      dispatch(setProcessing(false));
    }
  };

  const handleApproveNode = async (nodeId: string) => {
    try {
      await agentOrchestrationService.approveArtifact(nodeId);
      // Reload artifacts to update the view
      const artifacts = await agentOrchestrationService.getArtifacts(currentProject!.id);
      const { nodes: newNodes, edges: newEdges } = calculateNodePositions(artifacts);
      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve artifact');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handleGenerate}
          disabled={isProcessing || !currentProject}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Generating Project Plan...' : 'Generate Project Plan'}
        </button>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="flex-grow h-[600px] bg-white rounded-lg shadow-md">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

const AIFlowVisualization: React.FC = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

export default AIFlowVisualization;
