import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  setNodes, 
  setEdges, 
  createNewProject, 
  setProjectName, 
  setProjectDescription, 
  setAIAssistantVisibility 
} from '../../store/slices/projectSlice';
import { RootState } from '../../store/store';
import { CreateProjectRequest, Node, Edge } from '../../types/project.types';
import { api } from '../../services/api';
import ReactFlow, { 
  Background, 
  Controls,
  Edge as FlowEdge, 
  Node as FlowNode 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { extractErrorMessage } from '../../utils/errorHandling';

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.project);
  const [localProjectName, setLocalProjectName] = useState('');
  const [localProjectDescription, setLocalProjectDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!localProjectName.trim()) {
      return;
    }

    const projectData: CreateProjectRequest = {
      name: localProjectName.trim(),
      description: localProjectDescription.trim(),
      methodology: 'agile',
      target_completion_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    try {
      await dispatch(createNewProject(projectData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      // Error will be handled by Redux state
      console.error('Failed to create project:', err);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalProjectName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalProjectDescription(e.target.value);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Project
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Project Name"
              value={localProjectName}
              onChange={handleNameChange}
              margin="normal"
              required
              error={!localProjectName.trim()}
              helperText={!localProjectName.trim() ? 'Project name is required' : ''}
            />
            <TextField
              fullWidth
              label="Project Description"
              value={localProjectDescription}
              onChange={handleDescriptionChange}
              margin="normal"
              multiline
              rows={4}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading || !localProjectName.trim()}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default NewProject;
