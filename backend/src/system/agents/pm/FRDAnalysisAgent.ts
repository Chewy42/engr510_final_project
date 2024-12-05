import { PMAgent, PMContext } from './PMAgent';

const FRD_TEMPLATE = `
Create a detailed Functional Requirements Document (FRD) based on the following:

Project Features:
{{features}}

Project Requirements:
{{requirements}}

Please analyze and provide:
1. Detailed functional specifications for each feature
2. System dependencies and integrations
3. Data flow diagrams (in mermaid format)
4. API endpoints and schemas
5. Performance requirements
6. Security requirements

Structure your response in markdown format with clear sections.
`;

interface FRDResult {
  functionalSpecs: {
    feature: string;
    specs: string[];
    dependencies: string[];
    apis: {
      endpoint: string;
      method: string;
      schema: string;
    }[];
  }[];
  dataFlows: string[];
  performance: {
    metric: string;
    requirement: string;
  }[];
  security: string[];
}

export class FRDAnalysisAgent extends PMAgent {
  constructor(context?: Partial<PMContext>) {
    super('PM:FRD::ANALYSIS', context);
  }

  public async execute(data: any): Promise<void> {
    try {
      this.emit('analysis:started', {
        message: 'Starting FRD analysis...'
      });

      // Generate FRD content
      const frdContent = await this.generateWithTemplate(FRD_TEMPLATE, {
        features: this.formatList(this.context.project.features),
        requirements: this.formatList(this.context.project.requirements)
      });

      // Parse and validate FRD content
      const frdResult = await this.parseFRDContent(frdContent);

      // Update project state with functional specifications
      await this.updateProjectState({
        functionalSpecs: frdResult.functionalSpecs,
        dataFlows: frdResult.dataFlows,
        performance: frdResult.performance,
        security: frdResult.security
      });

      // Create child tasks based on FRD analysis
      this.createChildTasks(frdResult);

      this.emit('analysis:completed', {
        message: 'FRD analysis completed',
        result: frdResult
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private formatList(items: string[] = []): string {
    return items.map(item => `- ${item}`).join('\n');
  }

  private async parseFRDContent(content: string): Promise<FRDResult> {
    const parsePrompt = `
    Parse the following FRD content into a structured format:

    ${content}

    Return the result in the following JSON format:
    {
      "functionalSpecs": [
        {
          "feature": "",
          "specs": [],
          "dependencies": [],
          "apis": [
            {
              "endpoint": "",
              "method": "",
              "schema": ""
            }
          ]
        }
      ],
      "dataFlows": [],
      "performance": [
        {
          "metric": "",
          "requirement": ""
        }
      ],
      "security": []
    }
    `;

    try {
      const parsedContent = await generateAIResponse(parsePrompt);
      const result = JSON.parse(parsedContent);

      // Validate the parsed content
      this.validateFRDResult(result);

      return result;
    } catch (error) {
      this.handleError(new Error('Failed to parse FRD content: ' + error.message));
      throw error;
    }
  }

  private validateFRDResult(result: FRDResult): void {
    if (!result.functionalSpecs || !Array.isArray(result.functionalSpecs)) {
      throw new Error('Invalid FRD result: missing or invalid functional specs');
    }

    for (const spec of result.functionalSpecs) {
      if (!spec.feature || !Array.isArray(spec.specs)) {
        throw new Error('Invalid functional spec format');
      }
    }
  }

  private createChildTasks(frdResult: FRDResult): void {
    // Create Technical Design task
    this.addChild(new TechnicalDesignAgent({
      ...this.context,
      project: {
        ...this.context.project,
        functionalSpecs: frdResult.functionalSpecs,
        dataFlows: frdResult.dataFlows
      }
    }));

    // Create Architecture Design task
    this.addChild(new ArchitectureDesignAgent({
      ...this.context,
      project: {
        ...this.context.project,
        performance: frdResult.performance,
        security: frdResult.security
      }
    }));
  }

  protected validateResponse(response: string): boolean {
    // Ensure the response contains key FRD sections
    const requiredSections = [
      'Functional Specifications',
      'System Dependencies',
      'Data Flow',
      'API Endpoints',
      'Performance Requirements',
      'Security Requirements'
    ];

    return requiredSections.every(section => 
      response.includes(section)
    );
  }
}
