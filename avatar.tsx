/**
 * SOLARIS CET - AI Agent Bridge
 * Punte de conectare pentru agenți AI externi
 */

import { QuantumAI, type AIRequest } from '@/ai/QuantumAI';
import { TokenGate } from '@/blockchain/TokenGate';

export interface AgentConnection {
  id: string;
  name: string;
  type: 'external' | 'internal' | 'hybrid';
  endpoint?: string;
  apiKey?: string;
  capabilities: string[];
  rateLimit: number;
  lastUsed: number;
  totalRequests: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AgentMessage {
  from: string;
  to: string;
  type: 'request' | 'response' | 'broadcast' | 'command';
  payload: any;
  timestamp: number;
  signature?: string;
}

export interface AgentTask {
  id: string;
  type: string;
  priority: number;
  data: any;
  assignedTo?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  createdAt: number;
  completedAt?: number;
}

export interface HighIntelligenceConfig {
  quantumEnabled: boolean;
  entanglementLevel: number;
  coherenceThreshold: number;
  autoEvolve: boolean;
  learningRate: number;
}

export class AgentBridge {
  private connections: Map<string, AgentConnection> = new Map();
  private messageQueue: AgentMessage[] = [];
  private tasks: Map<string, AgentTask> = new Map();
  private quantumAI: QuantumAI;
  private tokenGate: TokenGate;
  private highIntelligenceAgents: Map<string, HighIntelligenceConfig> = new Map();

  constructor(quantumAI: QuantumAI, tokenGate: TokenGate) {
    this.quantumAI = quantumAI;
    this.tokenGate = tokenGate;
    this.initializeInternalAgents();
  }

  private initializeInternalAgents(): void {
    // Agenți interni de înaltă inteligență
    const internalAgents: AgentConnection[] = [
      {
        id: 'quantum-oracle',
        name: 'Quantum Oracle',
        type: 'internal',
        capabilities: ['quantum-prediction', 'pattern-analysis', 'optimization', 'forecasting'],
        rateLimit: 1000,
        lastUsed: 0,
        totalRequests: 0,
        status: 'active'
      },
      {
        id: 'evolution-engine',
        name: 'Evolution Engine',
        type: 'internal',
        capabilities: ['self-improvement', 'code-generation', 'architecture-design', 'auto-optimization'],
        rateLimit: 500,
        lastUsed: 0,
        totalRequests: 0,
        status: 'active'
      },
      {
        id: 'consensus-validator',
        name: 'Consensus Validator',
        type: 'internal',
        capabilities: ['validation', 'verification', 'consensus', 'security-check'],
        rateLimit: 2000,
        lastUsed: 0,
        totalRequests: 0,
        status: 'active'
      },
      {
        id: 'knowledge-synthesizer',
        name: 'Knowledge Synthesizer',
        type: 'internal',
        capabilities: ['knowledge-graph', 'semantic-analysis', 'reasoning', 'inference'],
        rateLimit: 800,
        lastUsed: 0,
        totalRequests: 0,
        status: 'active'
      }
    ];

    for (const agent of internalAgents) {
      this.connections.set(agent.id, agent);
      this.highIntelligenceAgents.set(agent.id, {
        quantumEnabled: true,
        entanglementLevel: 0.8,
        coherenceThreshold: 0.9,
        autoEvolve: true,
        learningRate: 0.01
      });
    }
  }

  // Înregistrează un agent extern
  registerAgent(
    address: string,
    config: Omit<AgentConnection, 'id' | 'lastUsed' | 'totalRequests' | 'status'>
  ): AgentConnection | null {
    // Verifică dacă utilizatorul are permisiunea
    if (!this.tokenGate.canDevelopAI(address)) {
      console.error('User does not have AI development permissions');
      return null;
    }

    const id = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const agent: AgentConnection = {
      id,
      ...config,
      lastUsed: 0,
      totalRequests: 0,
      status: 'active'
    };

    this.connections.set(id, agent);
    
    // Configurează high intelligence
    this.highIntelligenceAgents.set(id, {
      quantumEnabled: true,
      entanglementLevel: 0.5,
      coherenceThreshold: 0.7,
      autoEvolve: false,
      learningRate: 0.005
    });

    return agent;
  }

  // Conectează un agent la platformă
  async connect(agentId: string, apiKey?: string): Promise<boolean> {
    const agent = this.connections.get(agentId);
    if (!agent) return false;

    if (agent.apiKey && agent.apiKey !== apiKey) {
      return false;
    }

    agent.status = 'active';
    agent.lastUsed = Date.now();
    
    this.connections.set(agentId, agent);
    
    // Trimite mesaj de bun venit
    this.broadcastMessage({
      from: 'system',
      to: agentId,
      type: 'broadcast',
      payload: { event: 'connected', timestamp: Date.now() },
      timestamp: Date.now()
    });

    return true;
  }

  // Deconectează un agent
  disconnect(agentId: string): void {
    const agent = this.connections.get(agentId);
    if (agent) {
      agent.status = 'inactive';
      this.connections.set(agentId, agent);
    }
  }

  // Trimite un mesaj către un agent
  async sendMessage(message: Omit<AgentMessage, 'timestamp'>): Promise<boolean> {
    const fullMessage: AgentMessage = {
      ...message,
      timestamp: Date.now()
    };

    // Verifică rate limiting
    const fromAgent = this.connections.get(message.from);
    if (fromAgent) {
      const timeSinceLastUse = Date.now() - fromAgent.lastUsed;
      const minInterval = 60000 / fromAgent.rateLimit; // ms între requesturi
      
      if (timeSinceLastUse < minInterval) {
        console.warn('Rate limit exceeded for agent:', message.from);
        return false;
      }

      fromAgent.lastUsed = Date.now();
      fromAgent.totalRequests++;
      this.connections.set(message.from, fromAgent);
    }

    // Procesează mesajul
    if (message.to === 'broadcast') {
      this.broadcastMessage(fullMessage);
    } else {
      this.messageQueue.push(fullMessage);
      await this.processMessage(fullMessage);
    }

    return true;
  }

  // Procesează un mesaj
  private async processMessage(message: AgentMessage): Promise<void> {
    const targetAgent = this.connections.get(message.to);
    if (!targetAgent || targetAgent.status !== 'active') return;

    switch (message.type) {
      case 'request':
        await this.handleRequest(message);
        break;
      case 'command':
        await this.handleCommand(message);
        break;
      case 'response':
        this.handleResponse(message);
        break;
    }
  }

  // Gestionează un request
  private async handleRequest(message: AgentMessage): Promise<void> {
    const { prompt, context, agentType, quantumEnhance } = message.payload;

    const request: AIRequest = {
      prompt,
      context,
      agentType,
      quantumEnhance
    };

    const response = await this.quantumAI.process(request);

    // Trimite răspunsul înapoi
    this.sendMessage({
      from: message.to,
      to: message.from,
      type: 'response',
      payload: response
    });
  }

  // Gestionează o comandă
  private async handleCommand(message: AgentMessage): Promise<void> {
    const { command, params } = message.payload;

    switch (command) {
      case 'create-task':
        const task = this.createTask(params.type, params.data, params.priority);
        this.sendMessage({
          from: message.to,
          to: message.from,
          type: 'response',
          payload: { taskId: task.id, status: 'created' }
        });
        break;

      case 'get-task-status':
        const taskStatus = this.tasks.get(params.taskId);
        this.sendMessage({
          from: message.to,
          to: message.from,
          type: 'response',
          payload: taskStatus
        });
        break;

      case 'evolve':
        await this.evolveAgent(message.from);
        break;

      case 'entangle':
        await this.entangleAgents(message.from, params.targetAgent);
        break;
    }
  }

  // Gestionează un răspuns
  private handleResponse(message: AgentMessage): void {
    // Procesează răspunsul (poate fi extins)
    console.log(`Received response from ${message.from}:`, message.payload);
  }

  // Broadcast mesaj către toți agenții
  private broadcastMessage(message: AgentMessage): void {
    for (const [id, agent] of this.connections) {
      if (agent.status === 'active' && id !== message.from) {
        this.messageQueue.push({
          ...message,
          to: id
        });
      }
    }
  }

  // Creează un task
  createTask(type: string, data: any, priority: number = 5): AgentTask {
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const task: AgentTask = {
      id,
      type,
      priority,
      data,
      status: 'pending',
      createdAt: Date.now()
    };

    this.tasks.set(id, task);
    
    // Atribuie task-ul unui agent disponibil
    this.assignTask(task);

    return task;
  }

  // Atribuie un task unui agent
  private async assignTask(task: AgentTask): Promise<void> {
    // Găsește cel mai potrivit agent
    const suitableAgents = Array.from(this.connections.values())
      .filter(agent => 
        agent.status === 'active' && 
        agent.capabilities.includes(task.type)
      )
      .sort((a, b) => b.rateLimit - a.rateLimit);

    if (suitableAgents.length === 0) {
      task.status = 'failed';
      this.tasks.set(task.id, task);
      return;
    }

    const selectedAgent = suitableAgents[0];
    task.assignedTo = selectedAgent.id;
    task.status = 'processing';
    this.tasks.set(task.id, task);

    // Trimite task-ul agentului
    this.sendMessage({
      from: 'system',
      to: selectedAgent.id,
      type: 'command',
      payload: {
        command: 'execute-task',
        params: { taskId: task.id, data: task.data }
      }
    });
  }

  // Completează un task
  completeTask(taskId: string, result: any): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = 'completed';
    task.result = result;
    task.completedAt = Date.now();
    this.tasks.set(taskId, task);

    // Notifică requester-ul
    this.sendMessage({
      from: task.assignedTo || 'system',
      to: 'system',
      type: 'response',
      payload: { taskId, result, status: 'completed' }
    });
  }

  // Evoluează un agent (auto-îmbunătățire)
  private async evolveAgent(agentId: string): Promise<void> {
    const config = this.highIntelligenceAgents.get(agentId);
    if (!config || !config.autoEvolve) return;

    // Crește nivelul de entanglement
    config.entanglementLevel = Math.min(1, config.entanglementLevel + config.learningRate);
    
    // Crește pragul de coerență
    config.coherenceThreshold = Math.min(0.99, config.coherenceThreshold + config.learningRate * 0.5);

    this.highIntelligenceAgents.set(agentId, config);

    console.log(`Agent ${agentId} evolved:`, config);
  }

  // Creează entanglement între agenți
  private async entangleAgents(agent1: string, agent2: string): Promise<void> {
    const config1 = this.highIntelligenceAgents.get(agent1);
    const config2 = this.highIntelligenceAgents.get(agent2);

    if (!config1 || !config2) return;

    // Crește entanglement-ul pentru ambii agenți
    config1.entanglementLevel = Math.min(1, config1.entanglementLevel + 0.1);
    config2.entanglementLevel = Math.min(1, config2.entanglementLevel + 0.1);

    this.highIntelligenceAgents.set(agent1, config1);
    this.highIntelligenceAgents.set(agent2, config2);

    console.log(`Agents ${agent1} and ${agent2} are now entangled`);
  }

  // Obține agenți de înaltă inteligență
  getHighIntelligenceAgents(): Array<{ connection: AgentConnection; config: HighIntelligenceConfig }> {
    const result: Array<{ connection: AgentConnection; config: HighIntelligenceConfig }> = [];
    
    for (const [id, config] of this.highIntelligenceAgents) {
      const connection = this.connections.get(id);
      if (connection) {
        result.push({ connection, config });
      }
    }

    return result.sort((a, b) => b.config.entanglementLevel - a.config.entanglementLevel);
  }

  // Getters
  getConnections(): AgentConnection[] {
    return Array.from(this.connections.values());
  }

  getActiveConnections(): AgentConnection[] {
    return Array.from(this.connections.values()).filter(c => c.status === 'active');
  }

  getTasks(): AgentTask[] {
    return Array.from(this.tasks.values());
  }

  getPendingTasks(): AgentTask[] {
    return Array.from(this.tasks.values()).filter(t => t.status === 'pending');
  }

  getMessageQueue(): AgentMessage[] {
    return [...this.messageQueue];
  }
}

// Export singleton
export const createAgentBridge = (quantumAI: QuantumAI, tokenGate: TokenGate) => {
  return new AgentBridge(quantumAI, tokenGate);
};

export default AgentBridge;
