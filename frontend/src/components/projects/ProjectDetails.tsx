import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import {
  fetchProject,
  fetchProjectArtifacts,
  fetchProjectAnalyses,
  createProjectAnalysis,
} from '../../store/slices/projectSlice';
import { AnalyzerType, ArtifactType, ProjectArtifact, AnalysisResult } from '../../types/project.types';
import CreateArtifactDialog from './CreateArtifactDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [createArtifactOpen, setCreateArtifactOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentProject, artifacts, analyses, isLoading, error } = useAppSelector(
    (state: RootState) => state.project
  );

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject(projectId));
      dispatch(fetchProjectArtifacts(projectId));
      dispatch(fetchProjectAnalyses(projectId));
    }
  }, [dispatch, projectId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditProject = () => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleCreateArtifact = () => {
    setCreateArtifactOpen(true);
  };

  const handleCreateAnalysis = async (analyzerType: AnalyzerType) => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      await dispatch(
        createProjectAnalysis({
          projectId,
          analysisData: { analyzer_type: analyzerType }
        })
      );
      setLoading(false);
    } catch (error) {
      console.error('Failed to create analysis:', error);
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!projectId) {
    return <div>No project ID provided</div>;
  }

  if (!currentProject) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Project not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentProject.name}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {currentProject.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={currentProject.methodology} color="primary" />
            <Chip label={currentProject.status} color="secondary" />
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleEditProject}
        >
          Edit Project
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Artifacts" />
          <Tab label="Analysis" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateArtifact}
            >
              Create Artifact
            </Button>
          </Box>
          <Grid container spacing={3}>
            {artifacts.map((artifact: ProjectArtifact) => (
              <Grid item xs={12} sm={6} md={4} key={artifact.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {artifact.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Version: {artifact.version}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {artifact.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton size="small" title="View Artifact">
                      <DescriptionIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Generate Analysis
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<AssessmentIcon />}
                onClick={() => handleCreateAnalysis('business_case')}
              >
                Business Case
              </Button>
              <Button
                variant="outlined"
                startIcon={<AssessmentIcon />}
                onClick={() => handleCreateAnalysis('requirements')}
              >
                Requirements
              </Button>
              <Button
                variant="outlined"
                startIcon={<AssessmentIcon />}
                onClick={() => handleCreateAnalysis('risk_assessment')}
              >
                Risk Assessment
              </Button>
            </Box>
          </Box>
          <Grid container spacing={3}>
            {analyses.map((analysis: AnalysisResult) => (
              <Grid item xs={12} key={analysis.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {analysis.analyzer_type}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {JSON.parse(analysis.analysis_data).summary}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Recommendations:
                    </Typography>
                    <Typography variant="body2">
                      {analysis.recommendations}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      <CreateArtifactDialog
        open={createArtifactOpen}
        onClose={() => setCreateArtifactOpen(false)}
        projectId={projectId}
      />
    </Box>
  );
};

export default ProjectDetails;
