const axios = require('axios');
const { EventEmitter } = require('events');

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithExponentialBackoff(fn, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY) {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0 || !isRetryableError(error)) {
            throw error;
        }
        
        console.log(`Retrying after ${delay}ms...`);
        await sleep(delay);
        return retryWithExponentialBackoff(fn, retries - 1, delay * 2);
    }
}

function isRetryableError(error) {
    return (
        error.response?.status === 429 || // Rate limit
        error.response?.status === 503 || // Service unavailable
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT'
    );
}

async function generateAIResponse(prompt, stream = false) {
    // Try Anthropic first
    try {
        if (stream) {
            return streamAnthropicResponse(prompt);
        }
        const response = await retryWithExponentialBackoff(async () => {
            const result = await axios.post('https://api.anthropic.com/v1/messages', {
                model: process.env.ANTHROPIC_MODEL,
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }]
            }, {
                headers: {
                    'x-api-key': process.env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                }
            });
            return result.data.content[0].text;
        });
        return response;
    } catch (error) {
        console.error('Error with Anthropic:', error);
        
        // Fallback to OpenAI
        try {
            if (stream) {
                return streamOpenAIResponse(prompt);
            }
            return await retryWithExponentialBackoff(async () => {
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: process.env.OPENAI_CHAT_MODEL,
                    messages: [
                        { role: "system", content: "You are a helpful AI assistant." },
                        { role: "user", content: prompt }
                    ]
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                return response.data.choices[0].message.content;
            });
        } catch (openAIError) {
            console.error('Error with OpenAI:', openAIError);
            
            // Final fallback to Ollama if enabled
            if (process.env.OLLAMA_ENABLED === 'true') {
                return await retryWithExponentialBackoff(async () => {
                    const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
                        model: process.env.OLLAMA_MODEL,
                        prompt: prompt,
                        stream: false
                    });
                    return response.data.response;
                });
            }
            throw openAIError;
        }
    }
}

async function* streamAnthropicResponse(prompt) {
    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: process.env.ANTHROPIC_MODEL,
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
            stream: true
        }, {
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            },
            responseType: 'stream'
        });

        for await (const chunk of response.data) {
            const lines = chunk.toString().split('\n').filter(line => line.trim());
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    if (data.type === 'content_block_delta') {
                        yield data.delta.text;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error streaming from Anthropic:', error);
        yield* streamOpenAIResponse(prompt);
    }
}

async function* streamOpenAIResponse(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: process.env.OPENAI_CHAT_MODEL,
            messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: prompt }
            ],
            stream: true
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            responseType: 'stream'
        });

        for await (const chunk of response.data) {
            const lines = chunk.toString().split('\n').filter(line => line.trim());
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    if (data.choices?.[0]?.delta?.content) {
                        yield data.choices[0].delta.content;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error streaming from OpenAI:', error);
        if (process.env.OLLAMA_ENABLED === 'true') {
            yield* streamOllamaResponse(prompt);
        } else {
            throw error;
        }
    }
}

async function* streamOllamaResponse(prompt) {
    try {
        const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
            model: process.env.OLLAMA_MODEL,
            prompt: prompt,
            stream: true
        }, {
            responseType: 'stream'
        });

        for await (const chunk of response.data) {
            const lines = chunk.toString().split('\n').filter(line => line.trim());
            for (const line of lines) {
                const data = JSON.parse(line);
                if (data.response) {
                    yield data.response;
                }
            }
        }
    } catch (error) {
        console.error('Error streaming from Ollama:', error);
        throw error;
    }
}

module.exports = {
    generateAIResponse,
    streamAnthropicResponse,
    streamOpenAIResponse,
    streamOllamaResponse
};
