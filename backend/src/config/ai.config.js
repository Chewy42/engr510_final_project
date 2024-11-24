const aiConfig = {
    defaultModel: process.env.AI_MODEL || 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
    apiEndpoint: process.env.AI_API_ENDPOINT || 'https://api.openai.com/v1',
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 2000,
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
    streamingEnabled: process.env.AI_STREAMING_ENABLED === 'true',
    retryAttempts: parseInt(process.env.AI_RETRY_ATTEMPTS) || 3,
    timeout: parseInt(process.env.AI_TIMEOUT) || 30000, // 30 seconds
};

module.exports = aiConfig;
