import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectState, CreateProjectRequest, Node, Edge } from '../../types/project.types';
import { api, APIError } from '../../services/api';
import { extractErrorMessage } from '../../utils/errorHandling';

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  isProcessing: false,
  showAIAssistant: false,
  nodes: [],
  edges: [],
  isDirty: false,
  prompt: '',
  artifacts: [],
  analyses: [],
  projectName: '',
  projectDescription: '',
  projectId: null
};

// Async thunks
export const fetchProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: string }
>(
  'project/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchProjectById = createAsyncThunk<
  Project,
  string,
  { rejectValue: string }
>(
  'project/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<Project>(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const createNewProject = createAsyncThunk<
  Project,
  CreateProjectRequest,
  { rejectValue: string }
>(
  'project/createNewProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await api.post<Project>('/projects', projectData);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        return rejectWithValue(error.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create project');
    }
  }
);

export const updateExistingProject = createAsyncThunk(
  'project/updateExistingProject',
  async ({ id, data }: { id: string; data: Partial<Project> }) => {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  }
);

export const deleteExistingProject = createAsyncThunk(
  'project/deleteExistingProject',
  async (id: string) => {
    await api.delete(`/projects/${id}`);
    return id;
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setShowAIAssistant: (state, action: PayloadAction<boolean>) => {
      state.showAIAssistant = action.payload;
    },
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
    setProjectDescription: (state, action: PayloadAction<string>) => {
      state.projectDescription = action.payload;
    },
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    createProjectArtifact: (state, action: PayloadAction<any>) => {
      // Handle artifact creation in state
      state.artifacts.push(action.payload);
    },
    setAIAssistantVisibility: (state, action: PayloadAction<boolean>) => {
      state.showAIAssistant = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch projects';
        state.projects = [];
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch project';
        state.currentProject = null;
      })
      .addCase(createNewProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(createNewProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || 'Failed to create project';
      })
      .addCase(updateExistingProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExistingProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to update project';
      })
      .addCase(deleteExistingProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
        state.error = null;
      })
      .addCase(deleteExistingProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Failed to delete project';
      });
  }
});

export const {
  clearError,
  setIsProcessing,
  setShowAIAssistant,
  setNodes,
  setEdges,
  setProjectName,
  setProjectDescription,
  setIsDirty,
  createProjectArtifact,
  setAIAssistantVisibility
} = projectSlice.actions;

export default projectSlice.reducer;
