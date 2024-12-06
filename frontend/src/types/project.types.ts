export type ProjectMethodology = 'agile' | 'waterfall' | 'hybrid';

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  target_completion_date: string;
  user_id: string;
  prompt?: string;
  methodology?: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  target_completion_date: string;
  methodology?: ProjectMethodology;
}

export enum ArtifactType {
  CODE = 'CODE',
  DOCUMENTATION = 'DOCUMENTATION',
  TEST = 'TEST',
  OTHER = 'OTHER'
}

export interface ProjectArtifact {
  id: number;
  project_id: number;
  type: string;
  content: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export enum AnalyzerType {
  COMPLEXITY = 'COMPLEXITY',
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE'
}

export interface AnalysisResult {
  id: number;
  project_id: number;
  analyzer_type: string;
  result: any;
  created_at: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  status?: ProjectStatus;
}

export interface CreateArtifactRequest {
  type: string;
  content: string;
  status: string;
  version?: number;
}

export interface CreateAnalysisRequest {
  analyzer_type: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    [key: string]: any;
  };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  style?: object;
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  isProcessing: boolean;
  showAIAssistant: boolean;
  nodes: Node[];
  edges: Edge[];
  isDirty: boolean;
  prompt: string;
  artifacts: any[];
  analyses: any[];
  projectName: string;
  projectDescription: string;
  projectId: string | null;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: number;
}
