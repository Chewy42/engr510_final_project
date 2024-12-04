import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import { fetchProjects, deleteExistingProject } from '../../store/slices/projectSlice';
import { ProjectMethodology, ProjectStatus, Project } from '../../types/project.types';
import CreateProjectDialog from './CreateProjectDialog';

const methodologyColors: Record<ProjectMethodology, 'primary' | 'secondary' | 'success'> = {
  agile: 'primary',
  waterfall: 'secondary',
  hybrid: 'success',
};

const statusColors: Record<ProjectStatus, 'primary' | 'success' | 'default' | 'warning' | 'error'> = {
  planning: 'primary',
  in_progress: 'warning',
  completed: 'success',
  on_hold: 'error',
};

const ProjectList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState<number | null>(null);

  const { projects, isLoading, error } = useAppSelector((state: RootState) => state.project);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = () => {
    setCreateDialogOpen(true);
  };

  const handleEditProject = (projectId: number) => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleViewProject = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDeleteClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProjectId) {
      await dispatch(deleteExistingProject(selectedProjectId));
      setDeleteDialogOpen(false);
      setSelectedProjectId(null);
    }
  };

  if (isLoading) {
    return <Typography>Loading projects...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
        >
          Create Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project: Project) => (
          <Grid item xs={12} sm={6} md={4} key={project.project_id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {project.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Chip
                    label={project.methodology}
                    color={methodologyColors[project.methodology]}
                    size="small"
                  />
                  <Chip
                    label={project.status}
                    color={statusColors[project.status]}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleViewProject(project.project_id)}
                  title="View Project"
                >
                  <AssessmentIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleEditProject(project.project_id)}
                  title="Edit Project"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(project.project_id)}
                  title="Delete Project"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CreateProjectDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectList;
