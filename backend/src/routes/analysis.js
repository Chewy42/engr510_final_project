const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');
const aiService = require('../services/ai/aiService');
const promptManager = require('../services/ai/promptManager');

// Create a new analysis
router.post('/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { analyzer_type } = req.body;
    const uid = req.user.uid;

    // Verify project ownership
    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(projectId, uid);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get project artifacts for analysis
    const artifacts = db.prepare('SELECT * FROM project_artifacts WHERE project_id = ?').all(projectId);

    // Prepare analysis prompt based on analyzer type
    let prompt;
    let template;
    let variables;

    switch (analyzer_type) {
      case 'business_case':
        template = 'business_analysis';
        variables = {
          projectName: project.name,
          description: project.description,
          artifacts: JSON.stringify(artifacts)
        };
        break;
      case 'requirements':
        template = 'requirements_analysis';
        variables = {
          projectName: project.name,
          description: project.description,
          methodology: project.methodology,
          artifacts: JSON.stringify(artifacts)
        };
        break;
      case 'risk_assessment':
        template = 'risk_analysis';
        variables = {
          projectName: project.name,
          description: project.description,
          methodology: project.methodology,
          artifacts: JSON.stringify(artifacts)
        };
        break;
      default:
        return res.status(400).json({ error: 'Invalid analyzer type' });
    }

    // Generate analysis using AI
    prompt = promptManager.fillTemplate(template, variables);
    const aiResponse = await aiService.generateResponse(prompt);

    // Store analysis results
    const result = db.prepare(`
      INSERT INTO analysis_results (project_id, analyzer_type, analysis_data, recommendations)
      VALUES (?, ?, ?, ?)
    `).run(projectId, analyzer_type, JSON.stringify(aiResponse.analysis), aiResponse.recommendations);

    res.status(201).json({
      analysis_id: result.lastInsertRowid,
      analysis: aiResponse.analysis,
      recommendations: aiResponse.recommendations
    });
  } catch (error) {
    console.error('Error creating analysis:', error);
    res.status(500).json({ error: 'Error creating analysis' });
  }
});

// Get all analyses for a project
router.get('/:projectId', auth, (req, res) => {
  try {
    const { projectId } = req.params;
    const uid = req.user.uid;

    // Verify project ownership
    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(projectId, uid);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const analyses = db.prepare(`
      SELECT * FROM analysis_results 
      WHERE project_id = ? 
      ORDER BY created_at DESC
    `).all(projectId);

    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ error: 'Error fetching analyses' });
  }
});

// Get a specific analysis
router.get('/:projectId/:analysisId', auth, (req, res) => {
  try {
    const { projectId, analysisId } = req.params;
    const uid = req.user.uid;

    // Verify project ownership
    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(projectId, uid);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const analysis = db.prepare(`
      SELECT * FROM analysis_results 
      WHERE id = ? AND project_id = ?
    `).get(analysisId, projectId);

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: 'Error fetching analysis' });
  }
});

module.exports = router;
