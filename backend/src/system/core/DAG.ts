import { EventEmitter } from 'events';
import { Agent, AgentContext, AgentMessage } from './Agent';

interface Node {
  id: string;
  agent: Agent;
  dependencies: string[];
  children: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface Edge {
  from: string;
  to: string;
}

export class DAG {
  private nodes: Map<string, Node>;
  private edges: Edge[];
  private events: EventEmitter;
  private running: boolean;
  private maxConcurrency: number;
  private runningNodes: Set<string>;

  constructor(maxConcurrency: number = 2) {
    this.nodes = new Map();
    this.edges = [];
    this.events = new EventEmitter();
    this.running = false;
    this.maxConcurrency = maxConcurrency;
    this.runningNodes = new Set();
  }

  public addNode(agent: Agent, dependencies: string[] = []): void {
    const node: Node = {
      id: agent.getId(),
      agent,
      dependencies,
      children: [],
      status: 'pending'
    };

    this.nodes.set(node.id, node);

    // Add edges for dependencies
    dependencies.forEach(depId => {
      this.edges.push({ from: depId, to: node.id });
      const depNode = this.nodes.get(depId);
      if (depNode) {
        depNode.children.push(node.id);
      }
    });

    // Set up event listeners
    agent.on('message', this.handleAgentMessage.bind(this));
  }

  private handleAgentMessage(message: AgentMessage): void {
    const node = this.nodes.get(message.metadata.agentId);
    if (!node) return;

    switch (message.type) {
      case 'agent:completed':
        this.completeNode(node.id);
        break;
      case 'agent:failed':
        this.failNode(node.id);
        break;
    }

    // Forward all messages
    this.events.emit('message', message);
  }

  private async completeNode(nodeId: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.status = 'completed';
    this.runningNodes.delete(nodeId);

    this.events.emit('node:completed', {
      nodeId,
      timestamp: Date.now()
    });

    // Try to run next nodes
    await this.runNextNodes();
  }

  private async failNode(nodeId: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    node.status = 'failed';
    this.runningNodes.delete(nodeId);

    this.events.emit('node:failed', {
      nodeId,
      timestamp: Date.now()
    });

    // Stop the DAG execution
    this.running = false;
  }

  private getReadyNodes(): Node[] {
    if (!this.running) return [];

    return Array.from(this.nodes.values()).filter(node => {
      if (node.status !== 'pending') return false;
      if (this.runningNodes.has(node.id)) return false;

      // Check if all dependencies are completed
      return node.dependencies.every(depId => {
        const dep = this.nodes.get(depId);
        return dep && dep.status === 'completed';
      });
    });
  }

  private async runNextNodes(): Promise<void> {
    if (!this.running) return;

    const availableSlots = this.maxConcurrency - this.runningNodes.size;
    if (availableSlots <= 0) return;

    const readyNodes = this.getReadyNodes();
    const nodesToRun = readyNodes.slice(0, availableSlots);

    for (const node of nodesToRun) {
      this.runningNodes.add(node.id);
      node.status = 'running';

      this.events.emit('node:started', {
        nodeId: node.id,
        timestamp: Date.now()
      });

      // Execute the agent
      try {
        await node.agent.execute({
          dagId: this.getId(),
          nodeId: node.id
        });
      } catch (error) {
        await this.failNode(node.id);
      }
    }
  }

  public async start(): Promise<void> {
    if (this.running) return;

    this.running = true;
    this.events.emit('dag:started', {
      dagId: this.getId(),
      timestamp: Date.now()
    });

    await this.runNextNodes();
  }

  public async stop(): Promise<void> {
    this.running = false;
    this.events.emit('dag:stopped', {
      dagId: this.getId(),
      timestamp: Date.now()
    });
  }

  public on(event: string, listener: (data: any) => void): void {
    this.events.on(event, listener);
  }

  public off(event: string, listener: (data: any) => void): void {
    this.events.off(event, listener);
  }

  private getId(): string {
    return 'dag:' + Date.now();
  }

  public getStatus(): {
    running: boolean;
    nodes: { id: string; status: string }[];
  } {
    return {
      running: this.running,
      nodes: Array.from(this.nodes.values()).map(node => ({
        id: node.id,
        status: node.status
      }))
    };
  }
}
