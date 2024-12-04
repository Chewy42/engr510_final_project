import React, { useState, useEffect } from 'react';
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

const Flow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject, isProcessing } = useSelector((state: RootState) => state.project);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentProject) {
      loadArtifacts();
    }
  }, [currentProject]);

  const loadArtifacts = async () => {
    if (!currentProject) return;
    
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

  const handleAnalyze = async () => {
    if (!currentProject) return;

    try {
      setError(null);

      // Execute analysis
      await agentOrchestrationService.executeAnalysis(currentProject.project_id.toString());

      // Load updated artifacts
      const artifacts = await agentOrchestrationService.getArtifacts(currentProject.project_id.toString());
      const { nodes: newNodes, edges: newEdges } = calculateNodePositions(artifacts);
      setNodes(newNodes as CustomNode[]);
      setEdges(newEdges);
    } catch (err) {
      setError('Analysis failed');
      console.error(err);
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
    <div className="w-full h-full">
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
