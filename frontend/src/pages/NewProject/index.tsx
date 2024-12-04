import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  Node,
  Edge,
  ConnectionMode,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { generateProjectStructure, saveProject, updateNodes, updateEdges } from '../../store/slices/projectSlice';
import { setAIAssistantVisibility } from '../../store/slices/uiSlice';
import CustomNode from '../../components/ProjectFlow/CustomNode';
import { colors, transitions } from '../../styles/materialTheme';

const nodeTypes = {
  custom: CustomNode,
};

const NewProject: React.FC = () => {
  const dispatch = useAppDispatch();
  const { nodes, edges, isLoading, error } = useSelector((state: RootState) => state.project);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    // Reset AI Assistant visibility when component unmounts
    return () => {
      dispatch(setAIAssistantVisibility(false));
    };
  }, [dispatch]);

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

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      // Show AI Assistant when generation starts
      dispatch(setAIAssistantVisibility(true));
      const result = await dispatch(generateProjectStructure(prompt)).unwrap();
      if (!result) {
        dispatch(setAIAssistantVisibility(false));
      }
    } catch (err) {
      console.error('Failed to generate project structure:', err);
      // Hide AI Assistant if generation fails
      dispatch(setAIAssistantVisibility(false));
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(saveProject()).unwrap();
    } catch (err) {
      console.error('Failed to save project:', err);
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
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                  }
                `}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </form>
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 mx-2.5 my-2.5">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          className="bg-gray-100 rounded-lg shadow-inner"
        >
          <Background />
          <Controls />
          <Panel position="top-right" className="space-x-2">
            <button
              className={`
                px-4 py-2 rounded-md shadow-sm transition-all duration-200
                ${
                  isLoading
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white hover:shadow-md text-gray-700'
                }
              `}
              onClick={handleSave}
              disabled={isLoading}
            >
              Save Project
            </button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default NewProject;
