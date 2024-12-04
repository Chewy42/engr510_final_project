const { generateAIResponse } = require('./ai.service');
const { EventEmitter } = require('events');

const eventEmitter = new EventEmitter();

class Task {
    constructor(type, data) {
        this.type = type;
        this.data = data;
        this.children = [];
    }

    async execute() {
        throw new Error('Execute method must be implemented');
    }

    emitUpdate(data) {
        eventEmitter.emit('taskUpdate', {
            type: this.type,
            ...data
        });
    }
}

class ProjectSetupTask extends Task {
    constructor(data) {
        super('PROJECT::STATE:SETUP', data);
    }

    async execute() {
        this.emitUpdate({ status: 'started', message: 'Setting up project structure...' });
        
        const prompt = `Create a project structure for: ${this.data.description}
        Consider the following aspects:
        1. Project scope and requirements
        2. Main components needed
        3. Initial architecture design`;

        const response = await generateAIResponse(prompt);
        
        // Parse the response and create child tasks
        this.children = [
            new PrdAnalysisTask({ ...this.data, projectStructure: response }),
            new UxAnalysisTask({ ...this.data, projectStructure: response })
        ];

        this.emitUpdate({ 
            status: 'completed',
            message: 'Project structure created',
            data: response
        });
    }
}

class PrdAnalysisTask extends Task {
    constructor(data) {
        super('PM:PRD::ANALYSIS', data);
    }

    async execute() {
        this.emitUpdate({ status: 'started', message: 'Analyzing product requirements...' });
        
        const prompt = `Analyze the following project and create a PRD:
        Project: ${this.data.description}
        Structure: ${this.data.projectStructure}
        
        Focus on:
        1. Core features and functionality
        2. User stories and requirements
        3. Technical specifications`;

        const response = await generateAIResponse(prompt);
        
        this.children = [
            new ComponentGenerationTask({ ...this.data, prd: response })
        ];

        this.emitUpdate({ 
            status: 'completed',
            message: 'PRD analysis completed',
            data: response
        });
    }
}

class UxAnalysisTask extends Task {
    constructor(data) {
        super('PM:UXSMD::ANALYSIS', data);
    }

    async execute() {
        this.emitUpdate({ status: 'started', message: 'Analyzing UX requirements...' });
        
        const prompt = `Analyze the UX requirements for:
        Project: ${this.data.description}
        Structure: ${this.data.projectStructure}
        
        Focus on:
        1. User flows and interactions
        2. Component hierarchy
        3. Visual structure`;

        const response = await generateAIResponse(prompt);
        
        this.children = [
            new ComponentGenerationTask({ ...this.data, uxAnalysis: response })
        ];

        this.emitUpdate({ 
            status: 'completed',
            message: 'UX analysis completed',
            data: response
        });
    }
}

class ComponentGenerationTask extends Task {
    constructor(data) {
        super('WEBAPP:COMPONENT::GENERATE', data);
    }

    async execute() {
        this.emitUpdate({ status: 'started', message: 'Generating component...' });
        
        const prompt = `Generate a React component based on:
        Project: ${this.data.description}
        PRD: ${this.data.prd || 'N/A'}
        UX Analysis: ${this.data.uxAnalysis || 'N/A'}
        
        Provide:
        1. Component structure
        2. Props and state
        3. Visual layout`;

        const response = await generateAIResponse(prompt);
        
        this.emitUpdate({ 
            status: 'completed',
            message: 'Component generated',
            data: response
        });
    }
}

module.exports = {
    eventEmitter,
    ProjectSetupTask,
    PrdAnalysisTask,
    UxAnalysisTask,
    ComponentGenerationTask
};
