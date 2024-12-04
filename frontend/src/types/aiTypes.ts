export type AgentType = 
  | 'STRATEGIC_ANALYSIS'
  | 'REQUIREMENTS_ANALYSIS'
  | 'RISK_ASSESSMENT'
  | 'WBS_SPECIALIST'
  | 'ARCHITECTURE_ADVISOR';

export type TaskStatus = 'pending' | 'started' | 'completed' | 'error';

export interface AgentTask {
  id: string;
  type: AgentType;
  status: TaskStatus;
  message?: string;
  children?: string[];
  result?: any;
}

export interface AnalysisResult {
  requirements: RequirementNode[];
  architecture: ArchitectureNode[];
  timeline: TimelineNode[];
  risks: RiskNode[];
}

export interface BaseNode {
  id: string;
  type: string;
  title: string;
  description: string;
}

export interface RequirementNode extends BaseNode {
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface ArchitectureNode extends BaseNode {
  component: string;
  dependencies: string[];
}

export interface TimelineNode extends BaseNode {
  duration: number;
  dependencies: string[];
}

export interface RiskNode extends BaseNode {
  impact: 'high' | 'medium' | 'low';
  probability: 'high' | 'medium' | 'low';
  mitigation: string;
}
