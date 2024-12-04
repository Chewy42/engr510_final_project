import { Project, ProjectArtifact, AnalysisResult } from './schema';
import { v4 as uuidv4 } from 'uuid';

export interface IRepository<T> {
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export class ProjectRepository implements IRepository<Project> {
  private projects: Map<string, Project> = new Map();

  async create(data: Omit<Project, 'id'>): Promise<Project> {
    const id = uuidv4();
    const project: Project = {
      ...data,
      id,
      created_at: new Date(),
      updated_at: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const project = await this.findById(id);
    if (!project) throw new Error(`Project with id ${id} not found`);

    const updatedProject: Project = {
      ...project,
      ...data,
      updated_at: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async delete(id: string): Promise<void> {
    this.projects.delete(id);
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async findAll(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }
}

export class ProjectArtifactRepository implements IRepository<ProjectArtifact> {
  private artifacts: Map<string, ProjectArtifact> = new Map();

  async create(data: Omit<ProjectArtifact, 'id'>): Promise<ProjectArtifact> {
    const id = uuidv4();
    const artifact: ProjectArtifact = {
      ...data,
      id,
      created_at: new Date()
    };
    this.artifacts.set(id, artifact);
    return artifact;
  }

  async update(id: string, data: Partial<ProjectArtifact>): Promise<ProjectArtifact> {
    const artifact = await this.findById(id);
    if (!artifact) throw new Error(`Artifact with id ${id} not found`);

    const updatedArtifact: ProjectArtifact = {
      ...artifact,
      ...data
    };
    this.artifacts.set(id, updatedArtifact);
    return updatedArtifact;
  }

  async delete(id: string): Promise<void> {
    this.artifacts.delete(id);
  }

  async findById(id: string): Promise<ProjectArtifact | null> {
    return this.artifacts.get(id) || null;
  }

  async findAll(): Promise<ProjectArtifact[]> {
    return Array.from(this.artifacts.values());
  }

  async findByProjectId(projectId: string): Promise<ProjectArtifact[]> {
    return Array.from(this.artifacts.values()).filter(
      artifact => artifact.project_id === projectId
    );
  }

  async findLatestVersion(projectId: string, type: string): Promise<number> {
    const artifacts = await this.findByProjectId(projectId);
    const versions = artifacts
      .filter(a => a.type === type)
      .map(a => a.version);
    return Math.max(0, ...versions);
  }
}

export class AnalysisResultRepository implements IRepository<AnalysisResult> {
  private results: Map<string, AnalysisResult> = new Map();

  async create(data: Omit<AnalysisResult, 'id'>): Promise<AnalysisResult> {
    const id = uuidv4();
    const result: AnalysisResult = {
      ...data,
      id,
      created_at: new Date()
    };
    this.results.set(id, result);
    return result;
  }

  async update(id: string, data: Partial<AnalysisResult>): Promise<AnalysisResult> {
    const result = await this.findById(id);
    if (!result) throw new Error(`Analysis result with id ${id} not found`);

    const updatedResult: AnalysisResult = {
      ...result,
      ...data
    };
    this.results.set(id, updatedResult);
    return updatedResult;
  }

  async delete(id: string): Promise<void> {
    this.results.delete(id);
  }

  async findById(id: string): Promise<AnalysisResult | null> {
    return this.results.get(id) || null;
  }

  async findAll(): Promise<AnalysisResult[]> {
    return Array.from(this.results.values());
  }

  async findByProjectId(projectId: string): Promise<AnalysisResult[]> {
    return Array.from(this.results.values()).filter(
      result => result.project_id === projectId
    );
  }
}
