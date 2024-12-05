export type ProjectMethodology = 'agile' | 'waterfall' | 'hybrid';

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';

export interface Project {
  project_id: number;
  uid: number;
  name: string;
  description: string;
  methodology: ProjectMethodology;
  status: ProjectStatus;
  target_completion_date: string;
  created_at: string;
  updated_at: string;
  flowData?: {
    nodes: Node[];
    edges: Edge[];
  };
}

export type ArtifactType = 'requirements' | 'wbs' | 'gantt' | 'risk_matrix' | 'documentation';

export interface ProjectArtifact {
  id: number;
  project_id: number;
  type: ArtifactType;
  content: string;
  version: number;
  status: string;
  approved_by?: number;
  created_at: string;
}

export type AnalyzerType = 'business_case' | 'requirements' | 'risk_assessment' | 'wbs' | 'quality';

export interface AnalysisResult {
  id: number;
  project_id: number;
  analyzer_type: AnalyzerType;
  analysis_data: string;
  recommendations: string;
  created_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  methodology: ProjectMethodology;
  target_completion_date: string;
  flowData?: {
    nodes: Node[];
    edges: Edge[];
  };
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  status?: ProjectStatus;
  flowData?: {
    nodes: Node[];
    edges: Edge[];
  };
}

export interface CreateArtifactRequest {
  type: ArtifactType;
  content: string;
  status: string;
  version?: number;
}

export interface CreateAnalysisRequest {
  analyzer_type: AnalyzerType;
}

export interface Position {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  type: string;
  position: Position;
  data: Record<string, any>;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface ProjectState {
  // Flow diagram state
  nodes: Node[];
  edges: Edge[];
  prompt: string;
  
  // Project management state
  projects: Project[];
  currentProject: Project | null;
  artifacts: ProjectArtifact[];
  analyses: AnalysisResult[];
  
  // Project creation state
  projectName: string;
  projectDescription: string;
  
  // UI state
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  projectId: string | null;
  isDirty: boolean;
}
