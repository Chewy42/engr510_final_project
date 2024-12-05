import { PMAgent, PMContext } from './PMAgent';

const PRD_TEMPLATE = `
Analyze the following project and create a comprehensive Product Requirements Document (PRD):

Project Name: {{name}}
Project Description: {{description}}
Design Aesthetics: {{design}}

Focus on:
1. Core Features and Functionality
2. User Stories and Requirements
3. Technical Specifications
4. Success Metrics
5. Timeline and Milestones

Please structure your response in markdown format with clear sections and bullet points.
`;

interface PRDResult {
  features: string[];
  requirements: string[];
  userStories: string[];
  technicalSpecs: string[];
  metrics: string[];
  timeline: {
    phase: string;
    duration: string;
    milestones: string[];
  }[];
}

export class PRDAnalysisAgent extends PMAgent {
  constructor(context?: Partial<PMContext>) {
    super('PM:PRD::ANALYSIS', context);
  }

  public async execute(data: any): Promise<void> {
    try {
      this.emit('analysis:started', {
        message: 'Starting PRD analysis...'
      });

      // Generate PRD content
      const prdContent = await this.generateWithTemplate(PRD_TEMPLATE, {
        name: this.context.project.name,
        description: this.context.project.description,
        design: this.context.project.design?.aesthetics?.text || 'No specific design requirements'
      });

      // Parse and validate PRD content
      const prdResult = await this.parsePRDContent(prdContent);

      // Update project state
      await this.updateProjectState({
        requirements: prdResult.requirements,
        features: prdResult.features
      });

      // Create child tasks based on PRD analysis
      this.createChildTasks(prdResult);

      this.emit('analysis:completed', {
        message: 'PRD analysis completed',
        result: prdResult
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private async parsePRDContent(content: string): Promise<PRDResult> {
    // Use AI to parse the PRD content into structured format
    const parsePrompt = `
    Parse the following PRD content into a structured format:

    ${content}

    Return the result in the following JSON format:
    {
      "features": [],
      "requirements": [],
      "userStories": [],
      "technicalSpecs": [],
      "metrics": [],
      "timeline": []
    }
    `;

    try {
      const parsedContent = await generateAIResponse(parsePrompt);
      const result = JSON.parse(parsedContent);

      // Validate the parsed content
      this.validatePRDResult(result);

      return result;
    } catch (error) {
      this.handleError(new Error('Failed to parse PRD content: ' + error.message));
      throw error;
    }
  }

  private validatePRDResult(result: PRDResult): void {
    const requiredFields = ['features', 'requirements', 'userStories', 'technicalSpecs', 'metrics', 'timeline'];
    
    for (const field of requiredFields) {
      if (!result[field] || !Array.isArray(result[field])) {
        throw new Error(`Invalid PRD result: missing or invalid ${field}`);
      }
    }
  }

  private createChildTasks(prdResult: PRDResult): void {
    // Create FRD Analysis task
    this.addChild(new FRDAnalysisAgent({
      ...this.context,
      project: {
        ...this.context.project,
        features: prdResult.features,
        requirements: prdResult.requirements
      }
    }));

    // Create UX Analysis task
    this.addChild(new UXAnalysisAgent({
      ...this.context,
      project: {
        ...this.context.project,
        userStories: prdResult.userStories
      }
    }));
  }

  protected validateResponse(response: string): boolean {
    // Ensure the response contains key PRD sections
    const requiredSections = [
      'Features',
      'Requirements',
      'User Stories',
      'Technical Specifications',
      'Success Metrics',
      'Timeline'
    ];

    return requiredSections.every(section => 
      response.includes(section)
    );
  }
}
