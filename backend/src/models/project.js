const db = require('../db/db');

class Project {
  static async create(projectData) {
    try {
      // Ensure user_id is set from uid if provided
      if (projectData.uid) {
        projectData.user_id = projectData.uid;
        delete projectData.uid;
      }
      const [project] = await db('projects').insert(projectData).returning('*');
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      return await db('projects').where({ id }).first();
    } catch (error) {
      console.error('Error finding project:', error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      // Convert uid to user_id if needed
      const user_id = userId;
      return await db('projects').where({ user_id });
    } catch (error) {
      console.error('Error finding projects by user:', error);
      throw error;
    }
  }

  static async update(id, projectData) {
    try {
      // Ensure user_id is set from uid if provided
      if (projectData.uid) {
        projectData.user_id = projectData.uid;
        delete projectData.uid;
      }
      const [updated] = await db('projects')
        .where({ id })
        .update(projectData)
        .returning('*');
      return updated;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await db('projects').where({ id }).del();
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

module.exports = Project;
