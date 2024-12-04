class PromptManager {
    constructor() {
        this.templates = new Map();
        this._initializeTemplates();
    }

    _initializeTemplates() {
        // Add default templates
        this.addTemplate('project_structure', 
            'Create a project structure for: {{projectType}}. Requirements: {{requirements}}');
        this.addTemplate('code_generation',
            'Generate code for: {{description}}. Language: {{language}}. Constraints: {{constraints}}');
        this.addTemplate('documentation',
            'Generate documentation for: {{component}}. Format: {{format}}. Include: {{details}}');

        // Project Analysis Templates
        this.addTemplate('business_analysis',
            'Analyze the business case for project: {{projectName}}\n' +
            'Project Description: {{description}}\n' +
            'Project Artifacts: {{artifacts}}\n\n' +
            'Please provide a comprehensive business analysis including:\n' +
            '1. Project viability assessment\n' +
            '2. Cost-benefit analysis\n' +
            '3. ROI calculations\n' +
            '4. Market analysis\n' +
            '5. Key recommendations\n\n' +
            'Format the response as a JSON object with "analysis" and "recommendations" fields.'
        );

        this.addTemplate('requirements_analysis',
            'Analyze the requirements for project: {{projectName}}\n' +
            'Project Description: {{description}}\n' +
            'Methodology: {{methodology}}\n' +
            'Project Artifacts: {{artifacts}}\n\n' +
            'Please provide a detailed requirements analysis including:\n' +
            '1. SMART goals definition\n' +
            '2. Stakeholder analysis\n' +
            '3. Core requirements\n' +
            '4. Use case recommendations\n' +
            '5. Key considerations and constraints\n\n' +
            'Format the response as a JSON object with "analysis" and "recommendations" fields.'
        );

        this.addTemplate('risk_analysis',
            'Perform risk assessment for project: {{projectName}}\n' +
            'Project Description: {{description}}\n' +
            'Methodology: {{methodology}}\n' +
            'Project Artifacts: {{artifacts}}\n\n' +
            'Please provide a comprehensive risk analysis including:\n' +
            '1. Risk identification\n' +
            '2. Impact analysis\n' +
            '3. Probability assessment\n' +
            '4. Mitigation strategies\n' +
            '5. SWOT analysis\n\n' +
            'Format the response as a JSON object with "analysis" and "recommendations" fields.'
        );

        this.addTemplate('wbs_generation',
            'Generate a Work Breakdown Structure for project: {{projectName}}\n' +
            'Project Description: {{description}}\n' +
            'Methodology: {{methodology}}\n' +
            'Project Artifacts: {{artifacts}}\n\n' +
            'Please provide a detailed WBS including:\n' +
            '1. Major deliverables\n' +
            '2. Work packages\n' +
            '3. Task dependencies\n' +
            '4. Resource requirements\n' +
            '5. Timeline estimates\n\n' +
            'Format the response as a JSON object with "analysis" and "recommendations" fields.'
        );

        this.addTemplate('quality_planning',
            'Create a quality assurance plan for project: {{projectName}}\n' +
            'Project Description: {{description}}\n' +
            'Methodology: {{methodology}}\n' +
            'Project Artifacts: {{artifacts}}\n\n' +
            'Please provide a comprehensive QA plan including:\n' +
            '1. Quality metrics definition\n' +
            '2. Testing strategy\n' +
            '3. Review processes\n' +
            '4. Compliance requirements\n' +
            '5. Quality control procedures\n\n' +
            'Format the response as a JSON object with "analysis" and "recommendations" fields.'
        );
    }

    addTemplate(name, template) {
        if (typeof template !== 'string') {
            throw new Error('Template must be a string');
        }
        this.templates.set(name, template);
    }

    getTemplate(name) {
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template '${name}' not found`);
        }
        return template;
    }

    fillTemplate(name, variables) {
        let template = this.getTemplate(name);
        
        // Replace all variables in the template
        Object.entries(variables).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            template = template.replace(placeholder, value);
        });

        // Check for any remaining unfilled placeholders
        const remainingPlaceholders = template.match(/{{.*?}}/g);
        if (remainingPlaceholders) {
            throw new Error(`Missing variables: ${remainingPlaceholders.join(', ')}`);
        }

        return template;
    }

    validatePrompt(prompt) {
        if (!prompt || typeof prompt !== 'string') {
            throw new Error('Invalid prompt format');
        }
        
        if (prompt.length < 10) {
            throw new Error('Prompt too short');
        }

        if (prompt.length > 4000) {
            throw new Error('Prompt too long');
        }

        return true;
    }
}

module.exports = new PromptManager();
