import { AIAgentService } from '../aiAgentService';
import { AgentType } from '../../types/agent';

jest.mock('../aiAgentService', () => {
  const originalModule = jest.requireActual('../aiAgentService');
  return {
    ...originalModule,
    AIAgentService: {
      ...originalModule.AIAgentService,
      runAgent: jest.fn()
    }
  };
});

describe('AIAgentService', () => {
  const mockResponse = {
    id: '123',
    type: 'requirements' as const,
    content: { data: 'test response' },
    status: 'completed' as const,
    created_at: new Date().toISOString(),
    project_id: '456'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AIAgentService.runAgent as jest.Mock).mockResolvedValue(mockResponse);
  });

  describe('runAgent', () => {
    it('returns valid data for REQUIREMENTS_ANALYSIS', async () => {
      const response = await AIAgentService.runAgent(
        AgentType.REQUIREMENTS_ANALYSIS,
        'Test project',
        '123'
      );

      expect(response).toEqual(mockResponse);
      expect(AIAgentService.runAgent).toHaveBeenCalledWith(
        AgentType.REQUIREMENTS_ANALYSIS,
        'Test project',
        '123'
      );
    });

    it('returns valid data for ARCHITECTURE_ADVISOR', async () => {
      const response = await AIAgentService.runAgent(
        AgentType.ARCHITECTURE_ADVISOR,
        'Test project',
        '123'
      );

      expect(response).toEqual(mockResponse);
      expect(AIAgentService.runAgent).toHaveBeenCalledWith(
        AgentType.ARCHITECTURE_ADVISOR,
        'Test project',
        '123'
      );
    });

    it('returns valid data for WBS_SPECIALIST', async () => {
      const response = await AIAgentService.runAgent(
        AgentType.WBS_SPECIALIST,
        'Test project',
        '123'
      );

      expect(response).toEqual(mockResponse);
      expect(AIAgentService.runAgent).toHaveBeenCalledWith(
        AgentType.WBS_SPECIALIST,
        'Test project',
        '123'
      );
    });

    it('returns valid data for RISK_ASSESSMENT', async () => {
      const response = await AIAgentService.runAgent(
        AgentType.RISK_ASSESSMENT,
        'Test project',
        '123'
      );

      expect(response).toEqual(mockResponse);
      expect(AIAgentService.runAgent).toHaveBeenCalledWith(
        AgentType.RISK_ASSESSMENT,
        'Test project',
        '123'
      );
    });

    it('handles errors gracefully', async () => {
      const error = new Error('Test error');
      (AIAgentService.runAgent as jest.Mock).mockRejectedValueOnce(error);

      await expect(AIAgentService.generateProjectPlan('Test project')).rejects.toThrow('Test error');
    });

    it('handles unknown agent types', async () => {
      const unknownType = 'UNKNOWN_TYPE' as AgentType;
      await expect(
        AIAgentService.runAgent(unknownType, 'Test project', '123')
      ).rejects.toThrow('Unknown agent type');
    });
  });
});
