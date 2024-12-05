import { EventEmitter } from 'events';
import { Agent } from './Agent';
import { DAG } from './DAG';
import { Queue } from './Queue';
import { State } from './State';

export interface SystemConfig {
  maxConcurrency?: number;
  stateOptions?: {
    persistence?: 'local' | 'cloud';
    backupInterval?: number;
    maxBackups?: number;
  };
}

export class System {
  private agents: Map<string, Agent>;
  private dag: DAG;
  private queue: Queue;
  private state: State;
  private events: EventEmitter;

  constructor(config: SystemConfig = {}) {
    this.agents = new Map();
    this.dag = new DAG(config.maxConcurrency);
    this.queue = new Queue(config.maxConcurrency);
    this.state = new State(config.stateOptions);
    this.events = new EventEmitter();

    // Set up event forwarding
    this.setupEventForwarding();
  }

  private setupEventForwarding(): void {
    // Forward DAG events
    this.dag.on('message', (message) => {
      this.events.emit('dag:message', message);
    });

    // Forward Queue events
    this.queue.on('task:added', (data) => {
      this.events.emit('queue:task:added', data);
    });
    this.queue.on('task:completed', (data) => {
      this.events.emit('queue:task:completed', data);
    });
    this.queue.on('task:failed', (data) => {
      this.events.emit('queue:task:failed', data);
    });

    // Forward State events
    this.state.on('state:updated', (data) => {
      this.events.emit('state:updated', data);
    });
    this.state.on('state:error', (data) => {
      this.events.emit('state:error', data);
    });
  }

  public registerAgent(agent: Agent): void {
    this.agents.set(agent.getId(), agent);
    
    // Forward agent events
    agent.on('message', (message) => {
      this.events.emit('agent:message', message);
    });
  }

  public async createSequence(
    sequence: { type: string; dependencies?: string[] }[]
  ): Promise<void> {
    // Create agents for each sequence item
    const agentMap = new Map<string, Agent>();

    for (const item of sequence) {
      const agent = this.agents.get(item.type);
      if (!agent) {
        throw new Error(`No agent registered for type: ${item.type}`);
      }
      agentMap.set(item.type, agent);
    }

    // Add nodes to DAG
    for (const item of sequence) {
      const agent = agentMap.get(item.type);
      this.dag.addNode(agent, item.dependencies || []);
    }
  }

  public async start(): Promise<void> {
    // Start all subsystems
    await Promise.all([
      this.queue.start(),
      this.dag.start()
    ]);

    this.events.emit('system:started', {
      timestamp: Date.now()
    });
  }

  public async stop(): Promise<void> {
    // Stop all subsystems
    await Promise.all([
      this.queue.stop(),
      this.dag.stop()
    ]);

    this.events.emit('system:stopped', {
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
    agents: number;
    dag: ReturnType<typeof DAG.prototype.getStatus>;
    queue: ReturnType<typeof Queue.prototype.getStatus>;
    state: ReturnType<typeof State.prototype.getStatus>;
  } {
    return {
      agents: this.agents.size,
      dag: this.dag.getStatus(),
      queue: this.queue.getStatus(),
      state: this.state.getStatus()
    };
  }

  public getAgent(type: string): Agent | undefined {
    return this.agents.get(type);
  }

  public getState(): State {
    return this.state;
  }

  public getQueue(): Queue {
    return this.queue;
  }

  public getDag(): DAG {
    return this.dag;
  }
}
