import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node as FlowNode,
  Edge as FlowEdge,
  Controls,
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  NodeChange,
  EdgeChange
} from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { AgentOrchestrationService, Artifact } from '../../services/AgentOrchestrationService';
import { Node, Edge } from '../../types/project.types';
import { setNodes, setEdges, setIsProcessing } from '../../store/slices/projectSlice';
import 'reactflow/dist/style.css';

interface Props {
  agentOrchestrationService: AgentOrchestrationService;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const calculateNodePositions = (artifacts: Artifact[]): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let y = 0;

  artifacts.forEach((artifact, index) => {
    // Create node for the artifact
    nodes.push({
      id: artifact.id,
      type: 'default',
      position: { x: 250, y: y },
      data: { label: artifact.name }
    });

    // If not the first node, create an edge from the previous node
    if (index > 0) {
      edges.push({
        id: `e${index}`,
        source: artifacts[index - 1].id,
        target: artifact.id,
        animated: true
      });
    }

    y += 100; // Increment vertical position for next node
  });

  return { nodes, edges };
};

const Flow: React.FC<Props> = ({ agentOrchestrationService, initialNodes = [], initialEdges = [] }) => {
  const dispatch = useDispatch();
  const currentProject = useSelector((state: RootState) => state.project.currentProject);
  const [nodes, setLocalNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setLocalEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isProcessingState, setIsProcessingState] = useState(false);

  const onConnect = useCallback(
    (params: Connection | FlowEdge) => setLocalEdges((eds) => addEdge(params, eds)),
    [setLocalEdges]
  );

  const onNodeClick = useCallback(async (event: React.MouseEvent, node: FlowNode) => {
    if (!currentProject?.id) return;
    
    try {
      setIsProcessingState(true);
      dispatch(setIsProcessing(true));
      
      await agentOrchestrationService.processNode(node.id, currentProject.id.toString());
      
      // Reload artifacts to update the view
      const artifacts = await agentOrchestrationService.getArtifacts(currentProject.id.toString());
      const { nodes: newNodes, edges: newEdges } = calculateNodePositions(artifacts);
      
      setLocalNodes(newNodes);
      setLocalEdges(newEdges);
      dispatch(setNodes(newNodes));
      dispatch(setEdges(newEdges));
    } catch (error) {
      console.error('Failed to process node click:', error);
    } finally {
      setIsProcessingState(false);
      dispatch(setIsProcessing(false));
    }
  }, [currentProject, agentOrchestrationService, dispatch, setLocalNodes, setLocalEdges]);

  useEffect(() => {
    const loadArtifacts = async () => {
      if (!currentProject?.id) return;
      
      try {
        const artifacts = await agentOrchestrationService.getArtifacts(currentProject.id.toString());
        const { nodes: newNodes, edges: newEdges } = calculateNodePositions(artifacts);
        
        setLocalNodes(newNodes);
        setLocalEdges(newEdges);
        dispatch(setNodes(newNodes));
        dispatch(setEdges(newEdges));
      } catch (error) {
        console.error('Failed to load artifacts:', error);
      }
    };

    loadArtifacts();
  }, [currentProject, agentOrchestrationService, dispatch, setLocalNodes, setLocalEdges]);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export const AIFlowVisualization: React.FC<Props> = (props) => (
  <ReactFlowProvider>
    <Flow {...props} />
  </ReactFlowProvider>
);
