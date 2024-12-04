import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from 'reactflow';
import {
  Project,
  ProjectArtifact,
  AnalysisResult,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateArtifactRequest,
  CreateAnalysisRequest,
} from '../../types/project.types';
import * as projectService from '../../services/projectService';
import { AppDispatch } from '../store';
import { wsService } from '../../services/wsInstance'; // Import WebSocket service

interface ProjectState {
  // Flow diagram state
  nodes: Node[];
  edges: Edge[];
  prompt: string;
  
  // Project management state
  projects: Project[];
  currentProject: Project | null;
  artifacts: ProjectArtifact[];
  analyses: AnalysisResult[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  projectId: string | null;
  isDirty: boolean;
}

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
  
  // UI state
  isLoading: false,
  error: null,
  projectId: null,
  isDirty: false,
};

export const generateProjectStructure = createAsyncThunk<
  { nodes: Node[]; edges: Edge[] },
  string,
  { dispatch: AppDispatch }
>(
  'project/generateStructure',
  async (prompt: string, { dispatch }) => {
    try {
      // Send message through WebSocket to start generation
      wsService.sendMessage(JSON.stringify({
        type: 'generate_project',
        prompt: prompt
      }));
      
      // Return empty arrays initially - the WebSocket messages will update the state
      return {
        nodes: [],
        edges: [],
      };
    } catch (error) {
      throw new Error('Failed to generate project structure');
    }
  }
);

export const saveProject = createAsyncThunk<
  { success: boolean },
  void,
  { dispatch: AppDispatch }
>(
  'project/save',
  async (_, { getState }) => {
    try {
      // TODO: Implement API call to save project
      // This would save the current state to your backend
      return {
        success: true,
      };
    } catch (error) {
      throw new Error('Failed to save project');
    }
  }
);

export const fetchProjects = createAsyncThunk<
  Project[],
  void,
  { dispatch: AppDispatch }
>(
  'project/fetchProjects',
  async () => {
    return await projectService.getProjects();
  }
);

export const fetchProject = createAsyncThunk<
  Project,
  number,
  { dispatch: AppDispatch }
>(
  'project/fetchProject',
  async (projectId: number) => {
    return await projectService.getProject(projectId);
  }
);

export const createNewProject = createAsyncThunk<
  Project,
  CreateProjectRequest,
  { dispatch: AppDispatch }
>(
  'project/createProject',
  async (data: CreateProjectRequest) => {
    return await projectService.createProject(data);
  }
);

export const updateExistingProject = createAsyncThunk<
  Project,
  { id: number; data: UpdateProjectRequest },
  { dispatch: AppDispatch }
>(
  'project/updateProject',
  async ({ id, data }: { id: number; data: UpdateProjectRequest }) => {
    return await projectService.updateProject(id, data);
  }
);

export const deleteExistingProject = createAsyncThunk<
  number,
  number,
  { dispatch: AppDispatch }
>(
  'project/deleteProject',
  async (id: number) => {
    await projectService.deleteProject(id);
    return id;
  }
);

export const fetchProjectArtifacts = createAsyncThunk<
  ProjectArtifact[],
  number,
  { dispatch: AppDispatch }
>(
  'project/fetchArtifacts',
  async (projectId: number) => {
    return await projectService.getArtifacts(projectId);
  }
);

export const createProjectArtifact = createAsyncThunk<
  ProjectArtifact,
  { projectId: number; data: CreateArtifactRequest },
  { dispatch: AppDispatch }
>(
  'project/createArtifact',
  async ({ projectId, data }: { projectId: number; data: CreateArtifactRequest }) => {
    return await projectService.createArtifact(projectId, data);
  }
);

export const createProjectAnalysis = createAsyncThunk<
  AnalysisResult,
  { projectId: number; data: CreateAnalysisRequest },
  { dispatch: AppDispatch }
>(
  'project/createAnalysis',
  async ({ projectId, data }: { projectId: number; data: CreateAnalysisRequest }) => {
    return await projectService.createAnalysis(projectId, data);
  }
);

export const fetchProjectAnalyses = createAsyncThunk<
  AnalysisResult[],
  number,
  { dispatch: AppDispatch }
>(
  'project/fetchAnalyses',
  async (projectId: number) => {
    return await projectService.getAnalyses(projectId);
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
      state.isDirty = true;
    },
    updateEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
      state.isDirty = true;
    },
    setPrompt: (state, action: PayloadAction<string>) => {
      state.prompt = action.payload;
    },
    resetProject: (state) => {
      return initialState;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.artifacts = [];
      state.analyses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateProjectStructure.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateProjectStructure.fulfilled, (state, action: PayloadAction<{ nodes: Node[]; edges: Edge[] }>) => {
        state.isLoading = false;
        state.nodes = action.payload.nodes;
        state.edges = action.payload.edges;
        state.isDirty = false;
      })
      .addCase(generateProjectStructure.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to generate project';
      })
      .addCase(saveProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveProject.fulfilled, (state) => {
        state.isLoading = false;
        state.isDirty = false;
      })
      .addCase(saveProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to save project';
      })
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(fetchProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.currentProject = action.payload;
      })
      .addCase(createNewProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.projects.push(action.payload);
      })
      .addCase(updateExistingProject.fulfilled, (state, action: PayloadAction<Project>) => {
        const index = state.projects.findIndex(p => p.project_id === action.payload.project_id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.project_id === action.payload.project_id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(deleteExistingProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.projects = state.projects.filter(p => p.project_id !== action.payload);
        if (state.currentProject?.project_id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(fetchProjectArtifacts.fulfilled, (state, action: PayloadAction<ProjectArtifact[]>) => {
        state.artifacts = action.payload;
      })
      .addCase(createProjectArtifact.fulfilled, (state, action: PayloadAction<ProjectArtifact>) => {
        state.artifacts.push(action.payload);
      })
      .addCase(fetchProjectAnalyses.fulfilled, (state, action: PayloadAction<AnalysisResult[]>) => {
        state.analyses = action.payload;
      })
      .addCase(createProjectAnalysis.fulfilled, (state, action: PayloadAction<AnalysisResult>) => {
        state.analyses.push(action.payload);
      });
  },
});

export const {
  updateNodes,
  updateEdges,
  setPrompt,
  resetProject,
  clearCurrentProject,
} = projectSlice.actions;

export default projectSlice.reducer;
