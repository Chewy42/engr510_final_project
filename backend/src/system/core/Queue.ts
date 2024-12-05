import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface QueueTask {
  id: string;
  type: string;
  data: any;
  priority: number;
  timestamp: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: Error;
  result?: any;
}

export class Queue {
  private tasks: QueueTask[];
  private events: EventEmitter;
  private running: boolean;
  private maxConcurrency: number;
  private runningTasks: Set<string>;
  private processorMap: Map<string, (task: QueueTask) => Promise<any>>;

  constructor(maxConcurrency: number = 2) {
    this.tasks = [];
    this.events = new EventEmitter();
    this.running = false;
    this.maxConcurrency = maxConcurrency;
    this.runningTasks = new Set();
    this.processorMap = new Map();
  }

  public registerProcessor(
    type: string,
    processor: (task: QueueTask) => Promise<any>
  ): void {
    this.processorMap.set(type, processor);
  }

  public async addTask(
    type: string,
    data: any,
    priority: number = 0
  ): Promise<string> {
    const task: QueueTask = {
      id: uuidv4(),
      type,
      data,
      priority,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.tasks.push(task);
    this.sortTasks();

    this.events.emit('task:added', {
      taskId: task.id,
      type: task.type,
      timestamp: task.timestamp
    });

    if (this.running) {
      await this.processNextTasks();
    }

    return task.id;
  }

  private sortTasks(): void {
    this.tasks.sort((a, b) => {
      // Higher priority first
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      // Older tasks first
      return a.timestamp - b.timestamp;
    });
  }

  private async processTask(task: QueueTask): Promise<void> {
    const processor = this.processorMap.get(task.type);
    if (!processor) {
      throw new Error(`No processor registered for task type: ${task.type}`);
    }

    task.status = 'running';
    this.runningTasks.add(task.id);

    this.events.emit('task:started', {
      taskId: task.id,
      type: task.type,
      timestamp: Date.now()
    });

    try {
      task.result = await processor(task);
      task.status = 'completed';

      this.events.emit('task:completed', {
        taskId: task.id,
        type: task.type,
        timestamp: Date.now(),
        result: task.result
      });
    } catch (error) {
      task.status = 'failed';
      task.error = error;

      this.events.emit('task:failed', {
        taskId: task.id,
        type: task.type,
        timestamp: Date.now(),
        error: error.message
      });
    }

    this.runningTasks.delete(task.id);
    
    // Remove completed or failed tasks
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }

  private async processNextTasks(): Promise<void> {
    if (!this.running) return;

    const availableSlots = this.maxConcurrency - this.runningTasks.size;
    if (availableSlots <= 0) return;

    const pendingTasks = this.tasks.filter(
      task => task.status === 'pending' && !this.runningTasks.has(task.id)
    );

    const tasksToProcess = pendingTasks.slice(0, availableSlots);
    await Promise.all(tasksToProcess.map(task => this.processTask(task)));
  }

  public async start(): Promise<void> {
    if (this.running) return;

    this.running = true;
    this.events.emit('queue:started', {
      timestamp: Date.now()
    });

    await this.processNextTasks();
  }

  public async stop(): Promise<void> {
    this.running = false;
    this.events.emit('queue:stopped', {
      timestamp: Date.now()
    });
  }

  public on(event: string, listener: (data: any) => void): void {
    this.events.on(event, listener);
  }

  public off(event: string, listener: (data: any) => void): void {
    this.events.off(event, listener);
  }

  public getStatus(): {
    running: boolean;
    pendingTasks: number;
    runningTasks: number;
  } {
    return {
      running: this.running,
      pendingTasks: this.tasks.filter(t => t.status === 'pending').length,
      runningTasks: this.runningTasks.size
    };
  }
}
