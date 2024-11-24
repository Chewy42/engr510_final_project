# AI Agents System: Implementation Guide

This guide explains how the AI agent system is implemented in Cofounder, focusing on the actual architecture and workflow.

## System Architecture

The AI agent system in Cofounder follows a directed acyclic graph (DAG) sequence for project generation and management. The system is built around several key components:

1. **Core System**
   - Event Emitter System for agent communication
   - State Management for project persistence
   - Queue System for task processing
   - Model Integration (GPT-4, Claude-3.5-Sonnet, Ollama)

2. **Project Initialization Sequence**
   ```yaml
   seq:project:init:v1:
     nodes:
       - op:PROJECT::STATE:SETUP
       - PM:PRD::ANALYSIS
       - PM:FRD::ANALYSIS
       - PM:DRD::ANALYSIS
       - PM:UXSMD::ANALYSIS
       - DB:SCHEMAS::GENERATE
       - DB:POSTGRES::GENERATE
       - PM:BRD::ANALYSIS
       - BACKEND:OPENAPI::DEFINE
       - BACKEND:ASYNCAPI::DEFINE
       - BACKEND:SERVER::GENERATE
       - PM:UXDMD::ANALYSIS
       - UX:SITEMAP::STRUCTURE
       - UX:DATAMAP::STRUCTURE
       - UX:DATAMAP::VIEWS
       - WEBAPP:STORE::GENERATE
       - WEBAPP:ROOT::GENERATE
       - WEBAPP:VIEW::GENERATE:MULTI
   ```

## Agent Types and Responsibilities

### 1. Product Management (PM) Agents
- **PRD Analysis**: Analyzes initial project description and generates product requirements
- **FRD Analysis**: Breaks down PRD into detailed feature specifications
- **BRD Analysis**: Determines backend requirements and API needs
- **UX Analysis**: Handles user experience mapping and design requirements

### 2. Database Agents
- **Schema Generator**: Creates database schemas based on data requirements
- **Postgres Generator**: Generates PostgreSQL database implementation

### 3. Backend Agents
- **OpenAPI Designer**: Creates REST API specifications if required
- **AsyncAPI Designer**: Handles WebSocket API specifications if needed
- **Server Generator**: Implements the backend server code

### 4. Frontend Agents
- **Store Generator**: Creates Redux store configuration
- **Root Generator**: Sets up the main React application structure
- **View Generator**: Implements individual React components and views

## Implementation Details

### 1. Environment Configuration
```env
# LLM Provider Configuration
LLM_PROVIDER = "OLLAMA" # or "OPENAI" or "ANTHROPIC"
EMBEDDING_MODEL = "nomic-embed-text:latest"

# Feature Toggles
RAG_REMOTE_ENABLE = TRUE
STATE_LOCAL = TRUE
AUTOEXPORT_ENABLE = TRUE
DESIGNER_ENABLE = TRUE
```

### 2. Agent Communication
Agents communicate through a structured event system:
```javascript
const events = {
  main: new EventEmitter(),
  log: {
    node: new EventEmitter(),
    sequence: new EventEmitter()
  }
};
```

### 3. Project State Management
```javascript
// State Loading
const state = await utils.load.local({ project });
// or
const state = await utils.load.cloud({ project });

// State Updates
await context.run({
  id: "op:PROJECT::STATE:UPDATE",
  context,
  data: {
    operation: { id: "operation_id" },
    type: "end",
    content: { key: "key", data: data }
  }
});
```

## Agent Sequence Flow

1. **Project Initialization**
   ```javascript
   await cofounder.system.run({
     id: "seq:project:init:v1",
     context: {
       project: project_name,
     },
     data: {
       pm: {
         details: {
           text: project_description,
           attachments: [],
           design: { aesthetics: { text: design_instructions } }
         }
       }
     }
   });
   ```

2. **Product Analysis**
   - PRD Agent analyzes project requirements
   - FRD Agent creates feature specifications
   - UX Agents determine site structure and data flow

3. **Technical Implementation**
   - Database Agents generate schemas and SQL
   - Backend Agents create API specifications and server code
   - Frontend Agents implement React components and state management

## Configuration and Customization

### 1. LLM Concurrency
Located in `./cofounder/api/system/structure/nodes/op/llm.yaml`:
```yaml
nodes:
 op:LLM::GEN:
  queue:
   concurrency: 2  # Default for step-by-step visibility
```

### 2. Model Selection
```yaml
models:
  chat: "gpt-4o-latest"
  fallback: "gpt-4o-mini"
  embedding: "text-embedding-3-small"
```

## Best Practices

1. **Project Structure**
   - Keep project descriptions focused and specific
   - Include clear design instructions if needed
   - Let the system handle the technical architecture

2. **Development Flow**
   - Use the dashboard for project management
   - Monitor the generation process through the console
   - Review generated code before deployment

3. **Iteration and Updates**
   - Use Ctrl+K/Cmd+K for UI component iterations
   - Monitor token usage during generations
   - Review and test generated code regularly

## Troubleshooting

1. **Generation Issues**
   - Check LLM provider configuration
   - Verify API keys and rate limits
   - Monitor console for error messages

2. **Performance Optimization**
   - Adjust LLM concurrency settings
   - Use local state storage for faster access
   - Enable caching when possible

## Security Notes

1. **API Keys**
   - Store in .env file
   - Never commit sensitive keys
   - Use appropriate key rotation

2. **State Management**
   - Enable local state for development
   - Use cloud state for production
   - Implement proper backup strategies