import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProjectState, Project, ProjectArtifact, AnalysisResult, CreateProjectRequest, CreateArtifactRequest, CreateAnalysisRequest, Node, Edge } from '../../types/project.types';

const initialState: ProjectState = {
  // Flow diagram state
  nodes: [],
  edges: [],
  prompt: '',
  
  // Project management state
  projects: [],
  currentProject: null,
  artifacts: [],
  analyses: [],
  
  // Project creation state
  projectName: '',
  projectDescription: '',
  
  // UI state
  isLoading: false,
  isProcessing: false,
  error: null,
  projectId: null,
  isDirty: false
};

// Async thunks
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/projects');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProject = createAsyncThunk(
  'project/fetchProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project');
    }
  }
);

export const createNewProject = createAsyncThunk(
  'project/createNewProject',
  async (projectData: CreateProjectRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/projects', projectData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const deleteExistingProject = createAsyncThunk(
  'project/deleteExistingProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      return projectId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

export const fetchProjectArtifacts = createAsyncThunk(
  'project/fetchProjectArtifacts',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/artifacts`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch artifacts');
    }
  }
);

export const createProjectArtifact = createAsyncThunk(
  'project/createProjectArtifact',
  async ({ projectId, artifactData }: { projectId: string; artifactData: CreateArtifactRequest }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/artifacts`, artifactData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create artifact');
    }
  }
);

export const fetchProjectAnalyses = createAsyncThunk(
  'project/fetchProjectAnalyses',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/projects/${projectId}/analyses`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analyses');
    }
  }
);

export const createProjectAnalysis = createAsyncThunk(
  'project/createProjectAnalysis',
  async ({ projectId, analysisData }: { projectId: string; analysisData: CreateAnalysisRequest }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/analyses`, analysisData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create analysis');
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
      state.isDirty = true;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
      state.isDirty = true;
    },
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },
    setProjectDescription: (state, action) => {
      state.projectDescription = action.payload;
    },
    setIsDirty: (state, action) => {
      state.isDirty = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Project
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
        if (action.payload.flowData) {
          state.nodes = action.payload.flowData.nodes;
          state.edges = action.payload.flowData.edges;
        }
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Project
      .addCase(createNewProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createNewProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Project
      .addCase(deleteExistingProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter(project => project.project_id.toString() !== action.payload);
      })
      .addCase(deleteExistingProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Artifacts
      .addCase(fetchProjectArtifacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectArtifacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artifacts = action.payload;
      })
      .addCase(fetchProjectArtifacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Artifact
      .addCase(createProjectArtifact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProjectArtifact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.artifacts.push(action.payload);
      })
      .addCase(createProjectArtifact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Analyses
      .addCase(fetchProjectAnalyses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectAnalyses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analyses = action.payload;
      })
      .addCase(fetchProjectAnalyses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Analysis
      .addCase(createProjectAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProjectAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.analyses.push(action.payload);
      })
      .addCase(createProjectAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setNodes, 
  setEdges, 
  setPrompt, 
  setProjectName,
  setProjectDescription,
  setIsDirty, 
  clearError 
} = projectSlice.actions;

export default projectSlice.reducer;
