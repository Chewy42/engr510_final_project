class Project {
    constructor({ id, name, description, status = 'initiation', userId }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.userId = userId;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            status: this.status,
            userId: this.userId
        };
    }
}

class ProjectArtifact {
    constructor({ id, projectId, type, content }) {
        this.id = id;
        this.projectId = projectId;
        this.type = type;
        this.content = content;
    }

    toJSON() {
        return {
            id: this.id,
            projectId: this.projectId,
            type: this.type,
            content: this.content
        };
    }
}

class AnalysisResult {
    constructor({ id, projectId, type, result }) {
        this.id = id;
        this.projectId = projectId;
        this.type = type;
        this.result = result;
    }

    toJSON() {
        return {
            id: this.id,
            projectId: this.projectId,
            type: this.type,
            result: this.result
        };
    }
}

module.exports = {
    Project,
    ProjectArtifact,
    AnalysisResult
};
