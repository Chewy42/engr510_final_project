import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  Node,
  Edge,
  ConnectionMode,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { generateProjectStructure, saveProject, updateNodes, updateEdges } from '../../store/slices/projectSlice';
import { setAIAssistantVisibility } from '../../store/slices/uiSlice';
import CustomNode from '../../components/ProjectFlow/CustomNode';
import { RequirementNode, ArchitectureNode, TimelineNode, RiskNode } from '../../components/GenerativeComponent/nodes/CustomNodes';

const nodeTypes = {
  custom: CustomNode,
  requirement: RequirementNode,
  architecture: ArchitectureNode,
  timeline: TimelineNode,
  risk: RiskNode,
};

const Flow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { nodes, edges, isLoading, error } = useSelector((state: RootState) => state.project);

  const onNodesChange = useCallback(
    (changes: any) => {
      dispatch(updateNodes(changes));
    },
    [dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      dispatch(updateEdges(changes));
    },
    [dispatch]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      fitView
    >
      <Background />
      <Controls />
      <Panel position="bottom-right">
        <button
          onClick={() => dispatch(saveProject())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={isLoading}
        >
          Save Project
        </button>
      </Panel>
    </ReactFlow>
  );
};

const NewProject: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.project);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    return () => {
      dispatch(setAIAssistantVisibility(false));
    };
  }, [dispatch]);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      dispatch(setAIAssistantVisibility(true));
      await dispatch(generateProjectStructure(prompt)).unwrap();
    } catch (err) {
      console.error('Failed to generate project structure:', err);
    } finally {
      dispatch(setAIAssistantVisibility(false));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header Section with Prompt Input */}
      <div className="flex-none py-8 px-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Ideas Into Reality
          </h1>
          <p className="text-xl text-gray-600">
            Describe your project vision, and let AI help you bring it to life
          </p>
          <form onSubmit={handlePromptSubmit} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Describe your project idea..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                  }
                `}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Flow Diagram Section */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default NewProject;
