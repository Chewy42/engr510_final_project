import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { agentOrchestrationService } from '../../services/agentOrchestration';
import { calculateNodePositions } from './utils/nodePositioning';
import { RequirementNode, ArchitectureNode, TimelineNode, RiskNode } from './nodes/CustomNodes';

interface Project {
  project_id: string;
  // Add other project properties here
}

interface ProjectState {
  currentProject: Project | null;
  isProcessing: boolean;
  // Add other state properties here
}

interface AgentOrchestrationService {
  getArtifacts: (projectId: string) => Promise<any>;
  generateArtifacts: () => Promise<{nodes: Node[], edges: Edge[]}>;
  approveArtifact: (nodeId: string) => Promise<void>;
  executeAnalysis: (projectId: string) => Promise<void>;
}

const nodeTypes = {
  requirement: RequirementNode,
  architecture: ArchitectureNode,
  timeline: TimelineNode,
  risk: RiskNode,
};

type CustomNode = Node & {
  type: keyof typeof nodeTypes;
};

interface Props {
  agentOrchestrationService: AgentOrchestrationService;
}

const Flow: React.FC<Props> = ({ agentOrchestrationService }) => {
  const dispatch = useAppDispatch();
  const { currentProject, isProcessing } = useSelector((state: RootState) => state.project);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isProcessingState, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentProject) {
      loadArtifacts();
    }
  }, [currentProject]);

  const loadArtifacts = async () => {
    if (!currentProject || !currentProject.project_id) return;
    
    try {
      const artifacts = await agentOrchestrationService.getArtifacts(currentProject.project_id.toString());
      const { nodes: newNodes, edges: newEdges } = calculateNodePositions(artifacts);
      setNodes(newNodes as CustomNode[]);
      setEdges(newEdges);
    } catch (err) {
      setError('Failed to load artifacts');
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await agentOrchestrationService.generateArtifacts();
      if (!result || !result.nodes || !result.edges) {
        throw new Error('Invalid response from server');
      }

      const processedNodes = result.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          label: node.data.label || 'Untitled Node'
        }
      }));

      setNodes(processedNodes);
      setEdges(result.edges);
    } catch (err) {
      setError('Failed to load artifacts');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveNode = async (nodeId: string) => {
    if (!currentProject) return;

    try {
      await agentOrchestrationService.approveArtifact(nodeId);
      // Reload artifacts to update the view
      const artifacts = await agentOrchestrationService.getArtifacts(currentProject.project_id.toString());
      const { nodes: newNodes, edges: newEdges } = calculateNodePositions(artifacts);
      setNodes(newNodes as CustomNode[]);
      setEdges(newEdges);
    } catch (err) {
      setError('Failed to approve artifact');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <div className="p-4">
        <button
          onClick={handleGenerate}
          disabled={isProcessingState}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isProcessingState ? 'Generating...' : 'Generate'}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};

const AIFlowVisualization: React.FC<Props> = ({ agentOrchestrationService }) => (
  <ReactFlowProvider>
    <Flow agentOrchestrationService={agentOrchestrationService} />
  </ReactFlowProvider>
);

export default AIFlowVisualization;
