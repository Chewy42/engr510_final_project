const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { APIError } = require('../middleware/errorHandler');

// Create a new project
router.post('/', async (req, res, next) => {
  try {
    const projectData = {
      name: req.body.name,
      description: req.body.description,
      prompt: req.body.prompt,
      structure: req.body.structure ? JSON.stringify(req.body.structure) : null,
      user_id: req.user?.id
    };

    const project = await Project.create(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error in project creation:', error);
    next(new APIError(500, 'Failed to create project'));
  }
});

// Get all projects for a user
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.findByUserId(req.user?.id);
    // Parse structure JSON for each project
    const parsedProjects = projects.map(project => ({
      ...project,
      structure: project.structure ? JSON.parse(project.structure) : null
    }));
    res.json(parsedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    next(new APIError(500, 'Failed to fetch projects'));
  }
});

// Get a specific project
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new APIError(404, 'Project not found');
    }
    if (project.user_id !== req.user?.id) {
      throw new APIError(403, 'Unauthorized access to project');
    }
    // Parse structure JSON
    res.json({
      ...project,
      structure: project.structure ? JSON.parse(project.structure) : null
    });
  } catch (error) {
    if (error instanceof APIError) {
      next(error);
    } else {
      console.error('Error fetching project:', error);
      next(new APIError(500, 'Failed to fetch project'));
    }
  }
});

// Update a project
router.put('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new APIError(404, 'Project not found');
    }
    if (project.user_id !== req.user?.id) {
      throw new APIError(403, 'Unauthorized access to project');
    }

    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      prompt: req.body.prompt,
      structure: req.body.structure ? JSON.stringify(req.body.structure) : project.structure
    };

    const updatedProject = await Project.update(req.params.id, updatedData);
    // Parse structure JSON
    res.json({
      ...updatedProject,
      structure: updatedProject.structure ? JSON.parse(updatedProject.structure) : null
    });
  } catch (error) {
    if (error instanceof APIError) {
      next(error);
    } else {
      console.error('Error updating project:', error);
      next(new APIError(500, 'Failed to update project'));
    }
  }
});

// Delete a project
router.delete('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new APIError(404, 'Project not found');
    }
    if (project.user_id !== req.user?.id) {
      throw new APIError(403, 'Unauthorized access to project');
    }

    await Project.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof APIError) {
      next(error);
    } else {
      console.error('Error deleting project:', error);
      next(new APIError(500, 'Failed to delete project'));
    }
  }
});

module.exports = router;
