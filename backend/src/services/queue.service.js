class TaskQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    addTask(task) {
        this.queue.push(task);
        if (!this.processing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        
        this.processing = true;
        const task = this.queue[0];

        try {
            await task.execute();
            this.queue.shift(); // Remove completed task
            
            if (task.children) {
                task.children.forEach(childTask => this.addTask(childTask));
            }
        } catch (error) {
            console.error('Error processing task:', error);
        }

        this.processing = false;
        if (this.queue.length > 0) {
            this.processQueue();
        }
    }
}

const taskQueue = new TaskQueue();
module.exports = taskQueue;
