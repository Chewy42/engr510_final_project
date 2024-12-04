const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');

// Create a new project
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, methodology, target_completion_date } = req.body;
    const uid = req.user.uid;

    const result = db.prepare(`
      INSERT INTO projects (uid, name, description, methodology, status, target_completion_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uid, name, description, methodology, 'planning', target_completion_date);

    res.status(201).json({
      project_id: result.lastInsertRowid,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

// Get all projects for a user
router.get('/', auth, (req, res) => {
  try {
    const projects = db.prepare(`
      SELECT * FROM projects WHERE uid = ? ORDER BY created_at DESC
    `).all(req.user.uid);

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Get a specific project
router.get('/:id', auth, (req, res) => {
  try {
    const project = db.prepare(`
      SELECT * FROM projects WHERE project_id = ? AND uid = ?
    `).get(req.params.id, req.user.uid);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Error fetching project' });
  }
});

// Update a project
router.put('/:id', auth, (req, res) => {
  try {
    const { name, description, methodology, status, target_completion_date } = req.body;
    const { id } = req.params;
    const uid = req.user.uid;

    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(id, uid);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    db.prepare(`
      UPDATE projects
      SET name = ?, description = ?, methodology = ?, status = ?, target_completion_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE project_id = ? AND uid = ?
    `).run(name, description, methodology, status, target_completion_date, id, uid);

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Error updating project' });
  }
});

// Delete a project
router.delete('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(id, uid);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete related records first
    db.prepare('DELETE FROM analysis_results WHERE project_id = ?').run(id);
    db.prepare('DELETE FROM project_artifacts WHERE project_id = ?').run(id);
    db.prepare('DELETE FROM projects WHERE project_id = ? AND uid = ?').run(id, uid);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
});

// Create a project artifact
router.post('/:id/artifacts', auth, (req, res) => {
  try {
    const { type, content } = req.body;
    const { id } = req.params;
    const uid = req.user.uid;

    // Verify project ownership
    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(id, uid);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const result = db.prepare(`
      INSERT INTO project_artifacts (project_id, type, content, status)
      VALUES (?, ?, ?, ?)
    `).run(id, type, content, 'pending');

    res.status(201).json({
      artifact_id: result.lastInsertRowid,
      message: 'Artifact created successfully'
    });
  } catch (error) {
    console.error('Error creating artifact:', error);
    res.status(500).json({ error: 'Error creating artifact' });
  }
});

// Get project artifacts
router.get('/:id/artifacts', auth, (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    // Verify project ownership
    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(id, uid);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const artifacts = db.prepare(`
      SELECT * FROM project_artifacts WHERE project_id = ? ORDER BY created_at DESC
    `).all(id);

    res.json(artifacts);
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    res.status(500).json({ error: 'Error fetching artifacts' });
  }
});

module.exports = router;
