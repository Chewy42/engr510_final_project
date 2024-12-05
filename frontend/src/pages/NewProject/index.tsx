import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Controls,
  ConnectionMode,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import { setNodes, setEdges, createNewProject, setProjectName, setProjectDescription } from '../../store/slices/projectSlice';
import { setAIAssistantVisibility } from '../../store/slices/uiSlice';
import CustomNode from '../../components/ProjectFlow/CustomNode';
import { RequirementNode, ArchitectureNode, TimelineNode, RiskNode } from '../../components/GenerativeComponent/nodes/CustomNodes';
import { CreateProjectRequest, Node, Edge } from '../../types/project.types';
import axios from 'axios';

const nodeTypes = {
  custom: CustomNode,
  requirement: RequirementNode,
  architecture: ArchitectureNode,
  timeline: TimelineNode,
  risk: RiskNode,
};

const Flow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { nodes, edges, isLoading, error, isDirty, projectName, projectDescription } = useSelector((state: RootState) => state.project);
  const [localProjectName, setLocalProjectName] = useState(projectName);
  const [localProjectDescription, setLocalProjectDescription] = useState(projectDescription);

  useEffect(() => {
    dispatch(setProjectName(localProjectName));
  }, [localProjectName, dispatch]);

  useEffect(() => {
    dispatch(setProjectDescription(localProjectDescription));
  }, [localProjectDescription, dispatch]);

  const onNodesChange = useCallback(
    (changes: any) => {
      dispatch(setNodes(changes));
    },
    [dispatch]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      dispatch(setEdges(changes));
    },
    [dispatch]
  );

  const handleSave = async () => {
    if (!isDirty) return;
    try {
      const projectData: CreateProjectRequest = {
        name: localProjectName,
        description: localProjectDescription,
        methodology: 'agile',
        target_completion_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      await dispatch(createNewProject(projectData)).unwrap();
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  // Auto-save when changes are made
  useEffect(() => {
    if (isDirty) {
      const timeoutId = setTimeout(handleSave, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [isDirty]);

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
          onClick={handleSave}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${isDirty ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-600'}
          `}
          disabled={isLoading || !isDirty}
        >
          {isLoading ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}
        </button>
      </Panel>
    </ReactFlow>
  );
};

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.project);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    return () => {
      dispatch(setAIAssistantVisibility(false));
    };
  }, [dispatch]);

  const handleGenerateProjectStructure = async () => {
    if (!prompt.trim()) {
      // Show error or notification
      return;
    }

    try {
      dispatch(setAIAssistantVisibility(true));
      
      const projectData: CreateProjectRequest = {
        name: '',
        description: '',
        methodology: 'agile',
        target_completion_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      const result = await dispatch(createNewProject(projectData)).unwrap();
      
      // After project creation, generate the structure
      const response = await axios.post('/api/generate-structure', {
        projectId: result.project_id,
        prompt
      });

      if (response.data.nodes.length > 0) {
        dispatch(setNodes(response.data.nodes));
        dispatch(setEdges(response.data.edges));
        navigate('/dashboard/projects');
      }
    } catch (err) {
      console.error('Failed to generate project structure:', err);
    } finally {
      dispatch(setAIAssistantVisibility(false));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header Section with Project Input */}
      <div className="flex-none py-8 px-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Ideas Into Reality
          </h1>
          <p className="text-xl text-gray-600">
            Describe your project vision, and let AI help you bring it to life
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto space-y-4">
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
                type="button"
                onClick={handleGenerateProjectStructure}
                className={`
                  px-6 py-3 rounded-lg font-medium transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    isLoading || !prompt.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                  }
                `}
                disabled={isLoading || !prompt.trim()}
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
