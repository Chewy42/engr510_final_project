const { generateAIResponse } = require('./ai.service');
const aiflowService = require('./aiflow.service');
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
        
        try {
            // Generate the initial flow
            const flow = await aiflowService.generateInitialFlow(this.data.description);
            
            // Emit updates for each node type
            const nodeTypes = ['requirement', 'architecture', 'timeline', 'risk'];
            nodeTypes.forEach(type => {
                const nodesOfType = flow.nodes.filter(node => node.type === type);
                if (nodesOfType.length > 0) {
                    this.emitUpdate({
                        status: 'processing',
                        message: `Generated ${type} nodes`,
                        data: {
                            nodes: nodesOfType,
                            edges: flow.edges.filter(edge => 
                                nodesOfType.some(node => 
                                    edge.source === node.id || edge.target === node.id
                                )
                            )
                        }
                    });
                }
            });

            // Create child tasks based on the generated flow
            this.children = [
                new PrdAnalysisTask({ ...this.data, flowId: flow.flowId }),
                new UxAnalysisTask({ ...this.data, flowId: flow.flowId })
            ];

            this.emitUpdate({ 
                status: 'completed',
                message: 'Project structure created',
                data: {
                    nodes: flow.nodes,
                    edges: flow.edges
                }
            });
        } catch (error) {
            this.emitUpdate({
                status: 'error',
                message: 'Failed to generate project structure',
                error: error.message
            });
            throw error;
        }
    }
}

class PrdAnalysisTask extends Task {
    constructor(data) {
        super('PM:PRD::ANALYSIS', data);
    }

    async execute() {
        this.emitUpdate({ status: 'started', message: 'Analyzing product requirements...' });
        
        try {
            const flowState = aiflowService.getFlowState(this.data.flowId);
            if (!flowState) {
                throw new Error('Flow state not found');
            }

            const prompt = `Analyze the following project and create a PRD:
            Project: ${this.data.description}
            Structure: ${JSON.stringify(flowState.projectStructure)}
            
            Focus on:
            1. Core features and functionality
            2. User stories and requirements
            3. Technical specifications`;

            if (this.data.stream) {
                this.emitUpdate({
                    status: 'streaming',
                    message: 'Generating PRD...',
                    stream: generateAIResponse(prompt, true)
                });
            } else {
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
        } catch (error) {
            this.emitUpdate({
                status: 'error',
                message: 'Failed to analyze PRD',
                error: error.message
            });
            throw error;
        }
    }
}

class UxAnalysisTask extends Task {
    constructor(data) {
        super('PM:UXSMD::ANALYSIS', data);
    }

    async execute() {
        this.emitUpdate({ status: 'started', message: 'Analyzing UX requirements...' });
        
        try {
            const flowState = aiflowService.getFlowState(this.data.flowId);
            if (!flowState) {
                throw new Error('Flow state not found');
            }

            const prompt = `Analyze the UX requirements for:
            Project: ${this.data.description}
            Structure: ${JSON.stringify(flowState.projectStructure)}
            
            Focus on:
            1. User flows and interactions
            2. Component hierarchy
            3. Visual structure`;

            if (this.data.stream) {
                this.emitUpdate({
                    status: 'streaming',
                    message: 'Generating UX analysis...',
                    stream: generateAIResponse(prompt, true)
                });
            } else {
                const response = await generateAIResponse(prompt);

                this.emitUpdate({ 
                    status: 'completed',
                    message: 'UX analysis completed',
                    data: response
                });
            }
        } catch (error) {
            this.emitUpdate({
                status: 'error',
                message: 'Failed to analyze UX',
                error: error.message
            });
            throw error;
        }
    }
}

class ComponentGenerationTask extends Task {
    constructor(data) {
        super('WEBAPP:COMPONENT::GENERATE', data);
    }

    async execute() {
        this.emitUpdate({ status: 'started', message: 'Generating component code...' });
        
        try {
            const flowState = aiflowService.getFlowState(this.data.flowId);
            if (!flowState) {
                throw new Error('Flow state not found');
            }

            const prompt = `Generate component code for:
            Project: ${this.data.description}
            PRD: ${this.data.prd}
            Structure: ${JSON.stringify(flowState.projectStructure)}
            
            Focus on:
            1. Component structure
            2. Props and state management
            3. Event handlers`;

            if (this.data.stream) {
                this.emitUpdate({
                    status: 'streaming',
                    message: 'Generating component code...',
                    stream: generateAIResponse(prompt, true)
                });
            } else {
                const response = await generateAIResponse(prompt);

                this.emitUpdate({ 
                    status: 'completed',
                    message: 'Component generation completed',
                    data: response
                });
            }
        } catch (error) {
            this.emitUpdate({
                status: 'error',
                message: 'Failed to generate component',
                error: error.message
            });
            throw error;
        }
    }
}

module.exports = {
    eventEmitter,
    ProjectSetupTask,
    PrdAnalysisTask,
    UxAnalysisTask,
    ComponentGenerationTask
};
