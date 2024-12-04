import { ProjectRepository } from '../repository';
import { Project } from '../schema';

describe('Repository Tests', () => {
  describe('ProjectRepository', () => {
    let repo: ProjectRepository;

    beforeEach(() => {
      repo = new ProjectRepository();
    });

    it('creates a project with valid data', async () => {
      const mockProject = {
        name: 'Test Project',
        description: 'A test project',
        methodology: 'agile' as const,
        status: 'active',
        owner_id: '123e4567-e89b-12d3-a456-426614174000'
      };

      const project = await repo.create(mockProject);
      expect(project.id).toBeDefined();
      expect(project.name).toBe(mockProject.name);
      expect(project.description).toBe(mockProject.description);
      expect(project.methodology).toBe(mockProject.methodology);
      expect(project.status).toBe(mockProject.status);
      expect(project.owner_id).toBe(mockProject.owner_id);
      expect(project.created_at).toBeDefined();
      expect(project.updated_at).toBeDefined();
    });

    it('finds a project by id', async () => {
      const created = await repo.create({
        name: 'Test Project',
        description: 'A test project',
        methodology: 'agile' as const,
        status: 'active',
        owner_id: '123e4567-e89b-12d3-a456-426614174000'
      });

      const found = await repo.findById(created.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe(created.name);
    });

    it('updates a project', async () => {
      const created = await repo.create({
        name: 'Test Project',
        description: 'A test project',
        methodology: 'agile' as const,
        status: 'active',
        owner_id: '123e4567-e89b-12d3-a456-426614174000'
      });

      // Wait a bit to ensure timestamps are different
      await new Promise(resolve => setTimeout(resolve, 100));

      const updated = await repo.update(created.id, { name: 'Updated Project' });
      expect(updated.name).toBe('Updated Project');
      expect(new Date(updated.updated_at).getTime()).toBeGreaterThan(new Date(created.updated_at).getTime());
    });

    it('deletes a project', async () => {
      const created = await repo.create({
        name: 'Test Project',
        description: 'A test project',
        methodology: 'agile' as const,
        status: 'active',
        owner_id: '123e4567-e89b-12d3-a456-426614174000'
      });

      await repo.delete(created.id);
      const found = await repo.findById(created.id);
      expect(found).toBeNull();
    });

    it('lists all projects', async () => {
      await repo.create({
        name: 'Project 1',
        description: 'First project',
        methodology: 'agile' as const,
        status: 'active',
        owner_id: '123e4567-e89b-12d3-a456-426614174000'
      });

      await repo.create({
        name: 'Project 2',
        description: 'Second project',
        methodology: 'waterfall' as const,
        status: 'active',
        owner_id: '123e4567-e89b-12d3-a456-426614174000'
      });

      const projects = await repo.findAll();
      expect(projects.length).toBe(2);
    });
  });
});
