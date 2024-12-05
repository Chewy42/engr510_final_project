const express = require('express');
const router = express.Router();
const db = require('../db/database');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { projectValidation, projectUpdateValidation, projectIdValidation } = require('../validators/project.validator');
const { APIError } = require('../middleware/errorHandler');

// Create a new project
router.post('/', auth, validate(projectValidation), async (req, res, next) => {
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
    next(error);
  }
});

// Get all projects for a user
router.get('/', auth, (req, res, next) => {
  try {
    const projects = db.prepare(`
      SELECT * FROM projects WHERE uid = ? ORDER BY created_at DESC
    `).all(req.user.uid);

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Get a specific project
router.get('/:id', auth, validate(projectIdValidation), (req, res, next) => {
  try {
    const project = db.prepare(`
      SELECT * FROM projects WHERE project_id = ? AND uid = ?
    `).get(req.params.id, req.user.uid);

    if (!project) {
      throw new APIError(404, 'Project not found');
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Update a project
router.put('/:id', auth, validate([...projectIdValidation, ...projectUpdateValidation]), (req, res, next) => {
  try {
    const { name, description, methodology, status, target_completion_date } = req.body;
    const { id } = req.params;
    const uid = req.user.uid;

    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(id, uid);
    if (!project) {
      throw new APIError(404, 'Project not found');
    }

    db.prepare(`
      UPDATE projects
      SET name = ?, description = ?, methodology = ?, status = ?, target_completion_date = ?, updated_at = CURRENT_TIMESTAMP
      WHERE project_id = ? AND uid = ?
    `).run(name, description, methodology, status, target_completion_date, id, uid);

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete a project
router.delete('/:id', auth, validate(projectIdValidation), (req, res, next) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(id, uid);
    if (!project) {
      throw new APIError(404, 'Project not found');
    }

    // Delete related records first (using a transaction)
    db.transaction(() => {
      db.prepare('DELETE FROM analysis_results WHERE project_id = ?').run(id);
      db.prepare('DELETE FROM project_artifacts WHERE project_id = ?').run(id);
      db.prepare('DELETE FROM projects WHERE project_id = ? AND uid = ?').run(id, uid);
    })();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Create a project artifact
router.post('/:id/artifacts', auth, (req, res, next) => {
  try {
    const { type, content } = req.body;
    const { id } = req.params;
    const uid = req.user.uid;

    // Verify project ownership
    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(id, uid);
    if (!project) {
      throw new APIError(404, 'Project not found');
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
    next(error);
  }
});

// Get project artifacts
router.get('/:id/artifacts', auth, (req, res, next) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    // Verify project ownership
    const project = db.prepare('SELECT * FROM projects WHERE project_id = ? AND uid = ?').get(id, uid);
    if (!project) {
      throw new APIError(404, 'Project not found');
    }

    const artifacts = db.prepare(`
      SELECT * FROM project_artifacts WHERE project_id = ? ORDER BY created_at DESC
    `).all(id);

    res.json(artifacts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
