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
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            try {
                await task.execute();
                this.queue.shift(); // Remove completed task
                
                if (task.children) {
                    task.children.forEach(childTask => this.addTask(childTask));
                }
                break; // Success, exit retry loop
            } catch (error) {
                console.error('Error processing task:', error);
                retryCount++;
                
                // Notify client of the error
                task.emitUpdate({ 
                    status: 'error',
                    message: error.message,
                    retryCount,
                    willRetry: retryCount < maxRetries
                });

                if (retryCount < maxRetries) {
                    // Wait before retrying (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
                } else {
                    // Max retries reached, remove the task
                    this.queue.shift();
                    task.emitUpdate({
                        status: 'failed',
                        message: 'Task failed after maximum retries'
                    });
                }
            }
        }

        this.processing = false;
        if (this.queue.length > 0) {
            this.processQueue();
        }
    }
}

const taskQueue = new TaskQueue();
module.exports = taskQueue;
