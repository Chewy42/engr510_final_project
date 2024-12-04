import { z } from 'zod';

// Validation schemas using Zod
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  methodology: z.enum(['agile', 'waterfall', 'hybrid']),
  status: z.string(),
  owner_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date()
});

export const ProjectArtifactSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  type: z.string(),
  content: z.any(),
  version: z.number().int().positive(),
  created_at: z.date(),
  status: z.enum(['pending', 'approved', 'rejected']),
  approved_by: z.string().uuid().optional()
});

export const AnalysisResultSchema = z.object({
  id: z.string().uuid(),
  project_id: z.string().uuid(),
  analyzer_type: z.string(),
  analysis_data: z.any(),
  recommendations: z.string(),
  created_at: z.date()
});

// TypeScript types inferred from Zod schemas
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectArtifact = z.infer<typeof ProjectArtifactSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
