import { AgentOrchestrationService } from '../agentOrchestrationService';
import { ProjectRepository } from '../../db/repository';

describe('AgentOrchestrationService', () => {
  let service: AgentOrchestrationService;
  let projectRepo: ProjectRepository;

  beforeEach(() => {
    service = new AgentOrchestrationService();
    projectRepo = new ProjectRepository();
  });

  describe('executeAnalysis', () => {
    const mockProject = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Project',
      description: 'A test project',
      methodology: 'agile' as const,
      status: 'active',
      owner_id: '123e4567-e89b-12d3-a456-426614174000',
      created_at: new Date(),
      updated_at: new Date()
    };

    beforeEach(async () => {
      await projectRepo.create(mockProject);
    });

    it('executes all agents in sequence', async () => {
      const agentCompleteSpy = jest.fn();
      service.on('agentComplete', agentCompleteSpy);

      await service.executeAnalysis(mockProject.id);

      // Should have called agentComplete for each agent
      expect(agentCompleteSpy).toHaveBeenCalledTimes(5);

      // Verify the sequence of agent executions
      const calls = agentCompleteSpy.mock.calls.map(call => call[0].type);
      expect(calls).toEqual([
        'STRATEGIC_ANALYSIS',
        'REQUIREMENTS_ANALYSIS',
        'ARCHITECTURE_ADVISOR',
        'WBS_SPECIALIST',
        'RISK_ASSESSMENT'
      ]);
    });

    it('saves artifacts for each agent result', async () => {
      await service.executeAnalysis(mockProject.id);

      // Verify artifacts were saved
      const artifacts = await service.getArtifacts(mockProject.id);
      expect(artifacts).toHaveLength(5);

      // Verify artifact types
      const types = artifacts.map(a => a.type);
      expect(types).toContain('strategic');
      expect(types).toContain('requirements');
      expect(types).toContain('architecture');
      expect(types).toContain('wbs');
      expect(types).toContain('risks');
    });

    it('handles agent failure gracefully', async () => {
      const errorSpy = jest.fn();
      service.on('error', errorSpy);

      // Mock a failure in one of the agents
      jest.spyOn(service as any, 'runAgent')
        .mockRejectedValueOnce(new Error('Agent failed'));

      await expect(service.executeAnalysis(mockProject.id))
        .rejects.toThrow('Agent failed');

      expect(errorSpy).toHaveBeenCalled();
    });

    it('passes context between agents correctly', async () => {
      const runAgentSpy = jest.spyOn(service as any, 'runAgent');

      await service.executeAnalysis(mockProject.id);

      // Verify each agent received the correct context
      expect(runAgentSpy).toHaveBeenCalledWith(
        'REQUIREMENTS_ANALYSIS',
        expect.objectContaining({
          strategicAnalysis: expect.any(Object)
        })
      );

      expect(runAgentSpy).toHaveBeenCalledWith(
        'ARCHITECTURE_ADVISOR',
        expect.objectContaining({
          requirements: expect.any(Object)
        })
      );

      expect(runAgentSpy).toHaveBeenCalledWith(
        'RISK_ASSESSMENT',
        expect.objectContaining({
          requirements: expect.any(Object),
          architecture: expect.any(Object),
          wbs: expect.any(Object)
        })
      );
    });

    it('maintains artifact versioning', async () => {
      // Run analysis twice
      await service.executeAnalysis(mockProject.id);
      await service.executeAnalysis(mockProject.id);

      const artifacts = await service.getArtifacts(mockProject.id);
      
      // Group artifacts by type
      const artifactsByType = artifacts.reduce((acc, artifact) => {
        if (!acc[artifact.type]) acc[artifact.type] = [];
        acc[artifact.type].push(artifact);
        return acc;
      }, {} as Record<string, any[]>);

      // Verify each type has two versions
      Object.values(artifactsByType).forEach(typeArtifacts => {
        expect(typeArtifacts).toHaveLength(2);
        expect(typeArtifacts[0].version).toBe(1);
        expect(typeArtifacts[1].version).toBe(2);
      });
    });
  });

  describe('Agent implementations', () => {
    it('strategic analysis returns valid data', async () => {
      const result = await (service as any).strategicAnalysis({});
      expect(result).toMatchObject({
        goals: expect.any(Array),
        marketAnalysis: expect.any(String),
        recommendations: expect.any(Array)
      });
    });

    it('requirements analysis returns valid data', async () => {
      const result = await (service as any).requirementsAnalysis({});
      expect(result).toMatchObject({
        functional: expect.any(Array),
        nonFunctional: expect.any(Array),
        constraints: expect.any(Array)
      });
    });

    it('architecture analysis returns valid data', async () => {
      const result = await (service as any).architectureAnalysis({});
      expect(result).toMatchObject({
        components: expect.any(Array),
        patterns: expect.any(Array),
        technologies: expect.any(Array)
      });
    });

    it('wbs analysis returns valid data', async () => {
      const result = await (service as any).wbsAnalysis({});
      expect(result).toMatchObject({
        phases: expect.any(Array),
        timeline: expect.any(Array),
        resources: expect.any(Array)
      });
    });

    it('risk analysis returns valid data', async () => {
      const result = await (service as any).riskAnalysis({});
      expect(result).toMatchObject({
        technical: expect.any(Array),
        business: expect.any(Array),
        mitigation: expect.any(Array)
      });
    });
  });
});
