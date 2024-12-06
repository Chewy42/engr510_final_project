const express = require('express');
const router = express.Router();
const aiService = require('../services/ai/aiService');
const promptManager = require('../services/ai/promptManager');
const authMiddleware = require('../middleware/auth');

// Middleware to validate AI requests
const validateAIRequest = (req, res, next) => {
    try {
        const { prompt, template, variables } = req.body;
        
        if (template) {
            // If using a template, validate the template and variables
            promptManager.getTemplate(template);
            if (!variables || typeof variables !== 'object') {
                throw new Error('Template variables must be provided as an object');
            }
        } else if (prompt) {
            // If using direct prompt, validate it
            promptManager.validatePrompt(prompt);
        } else {
            throw new Error('Either prompt or template must be provided');
        }
        
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Generate AI response
router.post('/generate', 
    authMiddleware,
    validateAIRequest,
    async (req, res) => {
        try {
            const { prompt, template, variables, options } = req.body;
            
            // Get final prompt either directly or from template
            const finalPrompt = template 
                ? promptManager.fillTemplate(template, variables)
                : prompt;

            const response = await aiService.generateResponse(finalPrompt, options);
            res.json({ response });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Stream AI response
router.post('/stream',
    authMiddleware,
    validateAIRequest,
    async (req, res) => {
        try {
            const { prompt, template, variables, options } = req.body;
            
            const finalPrompt = template 
                ? promptManager.fillTemplate(template, variables)
                : prompt;

            const stream = await aiService.streamResponse(finalPrompt, options);
            
            // Set headers for SSE
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            stream.on('data', (chunk) => {
                res.write(`data: ${chunk}\n\n`);
            });

            stream.on('end', () => {
                res.end();
            });

            stream.on('error', (error) => {
                res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
                res.end();
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Generate project structure
router.post('/generate-structure',
    authMiddleware,
    async (req, res) => {
        try {
            const { projectId, prompt } = req.body;
            
            if (!projectId || !prompt) {
                return res.status(400).json({ 
                    error: 'Project ID and prompt are required' 
                });
            }

            // Use the AI service to generate the project structure
            const template = 'project_structure';
            const variables = {
                prompt,
                projectId
            };

            const response = await aiService.generateResponse(template, {
                variables,
                temperature: 0.7,
                maxTokens: 2000
            });

            // Parse the response and create nodes/edges
            const { nodes, edges } = JSON.parse(response);

            res.json({ 
                success: true,
                nodes,
                edges,
                message: 'Project structure generated successfully'
            });
        } catch (error) {
            console.error('Project structure generation error:', error);
            res.status(500).json({ 
                error: 'Failed to generate project structure',
                details: error.message 
            });
        }
    }
);

module.exports = router;
