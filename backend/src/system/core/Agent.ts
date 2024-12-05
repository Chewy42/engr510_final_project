import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';

export interface AgentContext {
  id: string;
  type: string;
  state: any;
  parentId?: string;
  metadata: Record<string, any>;
}

export interface AgentMessage {
  id: string;
  type: string;
  content: any;
  metadata: Record<string, any>;
  timestamp: number;
}

export class Agent {
  protected id: string;
  protected type: string;
  protected context: AgentContext;
  protected events: EventEmitter;
  protected children: Agent[];
  protected parent?: Agent;

  constructor(type: string, context?: Partial<AgentContext>) {
    this.id = uuidv4();
    this.type = type;
    this.events = new EventEmitter();
    this.children = [];
    
    this.context = {
      id: this.id,
      type: this.type,
      state: {},
      metadata: {},
      ...context
    };
  }

  public async initialize(): Promise<void> {
    this.emit('agent:initialized', {
      id: this.id,
      type: this.type,
      timestamp: Date.now()
    });
  }

  public async execute(data: any): Promise<void> {
    throw new Error('Execute method must be implemented');
  }

  public addChild(agent: Agent): void {
    agent.setParent(this);
    this.children.push(agent);
  }

  public setParent(agent: Agent): void {
    this.parent = agent;
    this.context.parentId = agent.getId();
  }

  public getId(): string {
    return this.id;
  }

  public getType(): string {
    return this.type;
  }

  public getContext(): AgentContext {
    return this.context;
  }

  protected emit(type: string, content: any): void {
    const message: AgentMessage = {
      id: uuidv4(),
      type,
      content,
      metadata: {
        agentId: this.id,
        agentType: this.type,
        parentId: this.context.parentId
      },
      timestamp: Date.now()
    };

    this.events.emit(type, message);
    this.events.emit('message', message);
  }

  protected async updateState(update: any): Promise<void> {
    this.context.state = {
      ...this.context.state,
      ...update
    };

    this.emit('state:updated', {
      previous: this.context.state,
      current: update
    });
  }

  public on(event: string, listener: (message: AgentMessage) => void): void {
    this.events.on(event, listener);
  }

  public off(event: string, listener: (message: AgentMessage) => void): void {
    this.events.off(event, listener);
  }

  protected async handleError(error: Error): Promise<void> {
    this.emit('error', {
      error: error.message,
      stack: error.stack
    });
  }
}
