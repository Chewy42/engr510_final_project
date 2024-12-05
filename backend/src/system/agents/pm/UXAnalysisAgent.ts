import { PMAgent, PMContext } from './PMAgent';

const UX_TEMPLATE = `
Analyze the user experience requirements based on the following:

Project Description: {{description}}
User Stories:
{{userStories}}

Design Aesthetics: {{design}}

Please provide:
1. User Flow Analysis
2. UI Component Requirements
3. Interaction Patterns
4. Accessibility Requirements
5. Visual Design Guidelines
6. Error Handling and User Feedback

Structure your response in markdown format with clear sections.
`;

interface UXResult {
  userFlows: {
    name: string;
    steps: string[];
    components: string[];
  }[];
  components: {
    name: string;
    type: string;
    requirements: string[];
    interactions: string[];
    accessibility: string[];
  }[];
  visualDesign: {
    colors: string[];
    typography: {
      family: string;
      sizes: string[];
    };
    spacing: string[];
    animations: string[];
  };
  errorHandling: {
    scenario: string;
    feedback: string;
    resolution: string;
  }[];
}

export class UXAnalysisAgent extends PMAgent {
  constructor(context?: Partial<PMContext>) {
    super('PM:UX::ANALYSIS', context);
  }

  public async execute(data: any): Promise<void> {
    try {
      this.emit('analysis:started', {
        message: 'Starting UX analysis...'
      });

      // Generate UX analysis content
      const uxContent = await this.generateWithTemplate(UX_TEMPLATE, {
        description: this.context.project.description,
        userStories: this.formatList(this.context.project.userStories),
        design: this.context.project.design?.aesthetics?.text || 'No specific design requirements'
      });

      // Parse and validate UX content
      const uxResult = await this.parseUXContent(uxContent);

      // Update project state with UX specifications
      await this.updateProjectState({
        ux: {
          flows: uxResult.userFlows,
          components: uxResult.components,
          visualDesign: uxResult.visualDesign,
          errorHandling: uxResult.errorHandling
        }
      });

      // Create child tasks based on UX analysis
      this.createChildTasks(uxResult);

      this.emit('analysis:completed', {
        message: 'UX analysis completed',
        result: uxResult
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private formatList(items: string[] = []): string {
    return items.map(item => `- ${item}`).join('\n');
  }

  private async parseUXContent(content: string): Promise<UXResult> {
    const parsePrompt = `
    Parse the following UX analysis content into a structured format:

    ${content}

    Return the result in the following JSON format:
    {
      "userFlows": [
        {
          "name": "",
          "steps": [],
          "components": []
        }
      ],
      "components": [
        {
          "name": "",
          "type": "",
          "requirements": [],
          "interactions": [],
          "accessibility": []
        }
      ],
      "visualDesign": {
        "colors": [],
        "typography": {
          "family": "",
          "sizes": []
        },
        "spacing": [],
        "animations": []
      },
      "errorHandling": [
        {
          "scenario": "",
          "feedback": "",
          "resolution": ""
        }
      ]
    }
    `;

    try {
      const parsedContent = await generateAIResponse(parsePrompt);
      const result = JSON.parse(parsedContent);

      // Validate the parsed content
      this.validateUXResult(result);

      return result;
    } catch (error) {
      this.handleError(new Error('Failed to parse UX content: ' + error.message));
      throw error;
    }
  }

  private validateUXResult(result: UXResult): void {
    const requiredFields = ['userFlows', 'components', 'visualDesign', 'errorHandling'];
    
    for (const field of requiredFields) {
      if (!result[field]) {
        throw new Error(`Invalid UX result: missing ${field}`);
      }
    }

    // Validate user flows
    if (!Array.isArray(result.userFlows)) {
      throw new Error('Invalid UX result: userFlows must be an array');
    }

    // Validate components
    if (!Array.isArray(result.components)) {
      throw new Error('Invalid UX result: components must be an array');
    }
  }

  private createChildTasks(uxResult: UXResult): void {
    // Create UI Design task
    this.addChild(new UIDesignAgent({
      ...this.context,
      project: {
        ...this.context.project,
        ux: {
          components: uxResult.components,
          visualDesign: uxResult.visualDesign
        }
      }
    }));

    // Create Interaction Design task
    this.addChild(new InteractionDesignAgent({
      ...this.context,
      project: {
        ...this.context.project,
        ux: {
          flows: uxResult.userFlows,
          errorHandling: uxResult.errorHandling
        }
      }
    }));
  }

  protected validateResponse(response: string): boolean {
    // Ensure the response contains key UX sections
    const requiredSections = [
      'User Flow',
      'UI Components',
      'Interaction Patterns',
      'Accessibility',
      'Visual Design',
      'Error Handling'
    ];

    return requiredSections.every(section => 
      response.includes(section)
    );
  }
}
