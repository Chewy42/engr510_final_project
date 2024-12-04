const axios = require('axios');

async function generateAIResponse(prompt) {
    try {
        // Check if Ollama is enabled
        if (process.env.OLLAMA_ENABLED === 'true') {
            const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
                model: process.env.OLLAMA_MODEL,
                prompt: prompt,
                stream: false
            });
            return response.data.response;
        }
        
        // Fallback to OpenAI if Ollama is not enabled
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
    } catch (error) {
        console.error('Error generating AI response:', error);
        throw error;
    }
}

module.exports = {
    generateAIResponse
};
