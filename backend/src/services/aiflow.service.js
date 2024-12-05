const { generateAIResponse } = require('./ai.service');
const { v4: uuidv4 } = require('uuid');

class AIFlowService {
    constructor() {
        this.flowStates = new Map();
    }

    async generateInitialFlow(description) {
        const flowId = uuidv4();
        const initialState = {
            description,
            nodes: [],
            edges: [],
            status: 'initializing'
        };

        this.flowStates.set(flowId, initialState);

        try {
            // Generate initial project structure
            const projectStructure = await this.generateProjectStructure(description);
            
            // Generate requirements nodes
            const requirementsNodes = await this.generateRequirements(description, projectStructure);
            
            // Generate architecture nodes
            const architectureNodes = await this.generateArchitecture(description, projectStructure);
            
            // Generate timeline nodes
            const timelineNodes = await this.generateTimeline(description, projectStructure);
            
            // Generate risk nodes
            const riskNodes = await this.generateRisks(description, projectStructure);

            // Combine all nodes and generate edges
            const allNodes = [
                ...requirementsNodes,
                ...architectureNodes,
                ...timelineNodes,
                ...riskNodes
            ];

            const edges = this.generateEdges(allNodes);

            // Update flow state
            const updatedState = {
                description,
                nodes: allNodes,
                edges,
                status: 'completed',
                projectStructure
            };

            this.flowStates.set(flowId, updatedState);
            return { flowId, ...updatedState };

        } catch (error) {
            this.flowStates.set(flowId, {
                ...initialState,
                status: 'error',
                error: error.message
            });
            throw error;
        }
    }

    async generateProjectStructure(description) {
        const prompt = `Analyze the following project and create a structured representation:
        
        Project Description: ${description}
        
        Provide a JSON response with the following structure:
        {
            "overview": {
                "title": string,
                "description": string,
                "goals": string[]
            },
            "components": {
                "frontend": string[],
                "backend": string[],
                "database": string[]
            },
            "architecture": {
                "style": string,
                "patterns": string[],
                "technologies": string[]
            }
        }`;

        const response = await generateAIResponse(prompt);
        return JSON.parse(response);
    }

    async generateRequirements(description, structure) {
        const prompt = `Generate requirements nodes for the following project:
        
        Project Description: ${description}
        Project Structure: ${JSON.stringify(structure)}
        
        Provide a JSON array of requirement nodes with the following structure:
        [{
            "id": string,
            "type": "requirement",
            "content": {
                "title": string,
                "description": string,
                "priority": "High" | "Medium" | "Low"
            },
            "dependencies": string[]
        }]`;

        const response = await generateAIResponse(prompt);
        return JSON.parse(response);
    }

    async generateArchitecture(description, structure) {
        const prompt = `Generate architecture nodes for the following project:
        
        Project Description: ${description}
        Project Structure: ${JSON.stringify(structure)}
        
        Provide a JSON array of architecture nodes with the following structure:
        [{
            "id": string,
            "type": "architecture",
            "content": {
                "title": string,
                "description": string,
                "component": string,
                "technologies": string[]
            },
            "dependencies": string[]
        }]`;

        const response = await generateAIResponse(prompt);
        return JSON.parse(response);
    }

    async generateTimeline(description, structure) {
        const prompt = `Generate timeline nodes for the following project:
        
        Project Description: ${description}
        Project Structure: ${JSON.stringify(structure)}
        
        Provide a JSON array of timeline nodes with the following structure:
        [{
            "id": string,
            "type": "timeline",
            "content": {
                "title": string,
                "description": string,
                "duration": number,
                "phase": string
            },
            "dependencies": string[]
        }]`;

        const response = await generateAIResponse(prompt);
        return JSON.parse(response);
    }

    async generateRisks(description, structure) {
        const prompt = `Generate risk assessment nodes for the following project:
        
        Project Description: ${description}
        Project Structure: ${JSON.stringify(structure)}
        
        Provide a JSON array of risk nodes with the following structure:
        [{
            "id": string,
            "type": "risk",
            "content": {
                "title": string,
                "description": string,
                "impact": "High" | "Medium" | "Low",
                "probability": "High" | "Medium" | "Low"
            },
            "dependencies": string[]
        }]`;

        const response = await generateAIResponse(prompt);
        return JSON.parse(response);
    }

    generateEdges(nodes) {
        const edges = [];
        nodes.forEach(node => {
            if (node.dependencies) {
                node.dependencies.forEach(depId => {
                    edges.push({
                        id: `${depId}-${node.id}`,
                        source: depId,
                        target: node.id,
                        type: 'smoothstep',
                        animated: true
                    });
                });
            }
        });
        return edges;
    }

    getFlowState(flowId) {
        return this.flowStates.get(flowId);
    }

    updateFlowState(flowId, update) {
        const currentState = this.flowStates.get(flowId);
        if (!currentState) {
            throw new Error('Flow not found');
        }

        const updatedState = {
            ...currentState,
            ...update
        };

        this.flowStates.set(flowId, updatedState);
        return updatedState;
    }
}

module.exports = new AIFlowService();
