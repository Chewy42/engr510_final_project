import axios from 'axios';
import {
  Project,
  ProjectArtifact,
  AnalysisResult,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateArtifactRequest,
  CreateAnalysisRequest,
} from '../types/project.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Project APIs
export const createProject = async (data: CreateProjectRequest): Promise<Project> => {
  const response = await api.post<Project>('/projects', data);
  return response.data;
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get<Project[]>('/projects');
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (id: number, data: UpdateProjectRequest): Promise<Project> => {
  const response = await api.put<Project>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

// Artifact APIs
export const createArtifact = async (projectId: number, data: CreateArtifactRequest): Promise<ProjectArtifact> => {
  const response = await api.post<ProjectArtifact>(`/projects/${projectId}/artifacts`, data);
  return response.data;
};

export const getArtifacts = async (projectId: number): Promise<ProjectArtifact[]> => {
  const response = await api.get<ProjectArtifact[]>(`/projects/${projectId}/artifacts`);
  return response.data;
};

// Analysis APIs
export const createAnalysis = async (projectId: number, data: CreateAnalysisRequest): Promise<AnalysisResult> => {
  const response = await api.post<AnalysisResult>(`/projects/${projectId}/analysis`, data);
  return response.data;
};

export const getAnalyses = async (projectId: number): Promise<AnalysisResult[]> => {
  const response = await api.get<AnalysisResult[]>(`/projects/${projectId}/analysis`);
  return response.data;
};

export const getAnalysis = async (projectId: number, analysisId: number): Promise<AnalysisResult> => {
  const response = await api.get<AnalysisResult>(`/projects/${projectId}/analysis/${analysisId}`);
  return response.data;
};
