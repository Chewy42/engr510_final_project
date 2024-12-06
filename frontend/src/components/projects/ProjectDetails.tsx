import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store/store';
import { fetchProjectById } from '../../store/slices/projectSlice';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { currentProject, isLoading, error } = useAppSelector(
    (state: RootState) => state.project
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  if (isLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentProject) {
    return (
      <Container maxWidth="lg">
        <Alert severity="info">Project not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {currentProject.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {currentProject.description}
          </Typography>
        </Box>
        
        {/* Project Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Project Details
          </Typography>
          <Typography variant="body1">
            <strong>Created:</strong>{' '}
            {new Date(currentProject.created_at || '').toLocaleDateString()}
          </Typography>
          {currentProject.prompt && (
            <Typography variant="body1">
              <strong>Prompt:</strong> {currentProject.prompt}
            </Typography>
          )}
          {currentProject.methodology && (
            <Typography variant="body1">
              <strong>Methodology:</strong> {currentProject.methodology}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectDetails;
