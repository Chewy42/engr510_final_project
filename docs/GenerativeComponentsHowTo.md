# Generative Components with React: Integration Guide

This guide explains how to implement and use generative components in React applications, with support for various AI models including GPT-4, Claude-3.5-Sonnet, and Ollama.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Setup and Configuration](#setup-and-configuration)
- [Core Components](#core-components)
- [AI Model Integration](#ai-model-integration)
- [State Management](#state-management)
- [Usage Examples](#usage-examples)

## Architecture Overview

The generative components system is built on a modular architecture that combines React components with AI model integration. The system consists of:

1. **Frontend Layer (React)**
   - React components for UI rendering
   - State management using Redux
   - WebSocket connections for real-time updates

2. **Backend Layer**
   - API endpoints for model communication
   - Model configuration and management
   - Response processing and streaming

3. **AI Integration Layer**
   - Model provider abstraction
   - Prompt management
   - Response handling

## Setup and Configuration

### Environment Configuration

```env
# AI Model Configuration
OLLAMA_ENABLED = TRUE
OLLAMA_URL = "http://localhost:11434"
OLLAMA_MODEL = "marco-o1:7b-fp16"
OLLAMA_EMBEDDING_MODEL = "nomic-embed-text:latest"

# OpenAI Configuration
OPENAI_CHAT_MODEL = "gpt-4o"
OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"

# Anthropic Configuration
ANTHROPIC_MODEL = "claude-3-sonnet-20241022"
```

### Required Dependencies

```json
{
  "dependencies": {
    "@xyflow/react": "latest",
    "react-redux": "latest",
    "redux": "latest"
  }
}
```

## Core Components

### 1. Flow Component
The Flow component manages the visual representation and interaction flow of generative components:

```tsx
import { ReactFlow, Controls, Background } from '@xyflow/react';

const Flow = ({ project }) => {
  // Node management
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  // Component logic
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};
```

### 2. Generative Node Component
Custom node component for handling AI model interactions:

```tsx
const GenerativeNode = ({ data }) => {
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    setIsProcessing(true);
    // AI model interaction logic
    setIsProcessing(false);
  };

  return (
    <div className="generative-node">
      {/* Node UI implementation */}
    </div>
  );
};
```

## AI Model Integration

### Model Configuration
The system supports multiple AI models through a provider abstraction:

```typescript
interface ModelProvider {
  type: 'openai' | 'anthropic' | 'ollama';
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

const modelConfig = {
  openai: {
    type: 'openai',
    model: process.env.OPENAI_CHAT_MODEL,
    apiKey: process.env.OPENAI_API_KEY
  },
  anthropic: {
    type: 'anthropic',
    model: process.env.ANTHROPIC_MODEL,
    apiKey: process.env.ANTHROPIC_API_KEY
  },
  ollama: {
    type: 'ollama',
    model: process.env.OLLAMA_MODEL,
    baseUrl: process.env.OLLAMA_URL
  }
};
```

### Response Processing
Handle model responses with streaming support:

```typescript
const processModelResponse = async (provider: ModelProvider, prompt: string) => {
  switch (provider.type) {
    case 'ollama':
      return await streamOllamaResponse(provider, prompt);
    case 'openai':
      return await streamOpenAIResponse(provider, prompt);
    case 'anthropic':
      return await streamAnthropicResponse(provider, prompt);
  }
};
```

## State Management

The system uses Redux for state management:

```typescript
// Store Configuration
const store = configureStore({
  reducer: {
    project: projectReducer,
    generative: generativeReducer
  }
});

// Generative Slice
const generativeSlice = createSlice({
  name: 'generative',
  initialState: {
    responses: {},
    activeModel: null,
    isProcessing: false
  },
  reducers: {
    setResponse: (state, action) => {
      state.responses[action.payload.id] = action.payload.response;
    },
    setActiveModel: (state, action) => {
      state.activeModel = action.payload;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    }
  }
});
```

## Usage Examples

### 1. Basic Implementation

```tsx
import { useGenerativeComponent } from './hooks/useGenerativeComponent';

const MyGenerativeComponent = () => {
  const { generate, response, isLoading } = useGenerativeComponent({
    model: 'gpt-4o',
    provider: 'openai'
  });

  return (
    <div>
      <button onClick={() => generate('Your prompt here')}>
        Generate Content
      </button>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>{response}</div>
      )}
    </div>
  );
};
```

### 2. Advanced Implementation with Multiple Models

```tsx
const MultiModelComponent = () => {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const { generate, response, isLoading } = useGenerativeComponent({
    model: selectedModel,
    provider: getProviderForModel(selectedModel)
  });

  return (
    <div>
      <ModelSelector
        value={selectedModel}
        onChange={setSelectedModel}
        options={['gpt-4o', 'claude-3-sonnet', 'marco-o1:7b-fp16']}
      />
      <GenerationInterface
        onGenerate={generate}
        response={response}
        isLoading={isLoading}
      />
    </div>
  );
};
```

## Best Practices

1. **Error Handling**
   - Implement robust error handling for API calls
   - Provide meaningful error messages to users
   - Handle network issues gracefully

2. **Performance Optimization**
   - Use debouncing for rapid user inputs
   - Implement response caching where appropriate
   - Optimize rendering with React.memo and useMemo

3. **Security**
   - Never expose API keys in client-side code
   - Implement rate limiting
   - Validate user inputs before sending to AI models

4. **Accessibility**
   - Include loading states and indicators
   - Provide keyboard navigation support
   - Add ARIA labels for screen readers

## Troubleshooting

Common issues and solutions:

1. **Model Connection Issues**
   - Verify API keys and endpoints
   - Check network connectivity
   - Confirm model availability

2. **Performance Problems**
   - Implement request debouncing
   - Optimize component rendering
   - Check for memory leaks

3. **State Management Issues**
   - Verify Redux action dispatches
   - Check reducer logic
   - Monitor state updates

## Conclusion

This implementation guide provides a foundation for building generative AI components in React applications. The modular architecture allows for easy integration of different AI models while maintaining a consistent user experience. Follow the best practices and security guidelines to ensure a robust and scalable implementation.