import { Agent, AgentContext } from '../../core/Agent';
import { generateAIResponse } from '../../../services/ai.service';

export interface PMContext extends AgentContext {
  project: {
    name: string;
    description: string;
    requirements?: string[];
    features?: string[];
    design?: {
      aesthetics?: {
        text: string;
      };
    };
  };
}

export abstract class PMAgent extends Agent {
  protected context: PMContext;

  constructor(type: string, context?: Partial<PMContext>) {
    super(type, context);
  }

  protected async generateWithTemplate(
    template: string,
    data: Record<string, any>
  ): Promise<string> {
    // Replace template variables
    let prompt = template;
    for (const [key, value] of Object.entries(data)) {
      prompt = prompt.replace(`{{${key}}}`, value);
    }

    try {
      const response = await generateAIResponse(prompt, true);
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  protected validateResponse(response: string): boolean {
    // Basic validation - can be overridden by specific agents
    return response.length > 0;
  }

  protected async updateProjectState(update: Partial<PMContext['project']>): Promise<void> {
    this.context.project = {
      ...this.context.project,
      ...update
    };

    this.emit('project:updated', {
      agentId: this.id,
      update
    });
  }
}
