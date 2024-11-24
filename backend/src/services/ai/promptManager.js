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
