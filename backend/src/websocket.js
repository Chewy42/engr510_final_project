const WebSocket = require('ws');
const taskQueue = require('./services/queue.service');
const { eventEmitter, ProjectSetupTask } = require('./services/tasks.service');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ 
        server,
        path: '/ws',
        verifyClient: (info) => {
            // Allow all origins in development
            return true;
        }
    });

    wss.on('connection', (ws, req) => {
        console.log('New WebSocket connection established from:', req.socket.remoteAddress);

        // Set up task update listener for this connection
        const taskUpdateListener = async (update) => {
            if (ws.readyState === WebSocket.OPEN) {
                if (update.stream) {
                    // Handle streaming updates
                    try {
                        for await (const chunk of update.stream) {
                            ws.send(JSON.stringify({
                                type: 'stream',
                                data: chunk
                            }));
                        }
                        ws.send(JSON.stringify({
                            type: 'stream_end'
                        }));
                    } catch (error) {
                        console.error('Streaming error:', error);
                        ws.send(JSON.stringify({
                            type: 'error',
                            error: error.message
                        }));
                    }
                } else {
                    // Handle regular updates
                    try {
                        ws.send(JSON.stringify({
                            type: 'task_update',
                            ...update
                        }));
                    } catch (error) {
                        console.error('Error sending task update:', error);
                    }
                }
            }
        };

        eventEmitter.on('taskUpdate', taskUpdateListener);

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                console.log('Received message:', data);
                
                if (data.content) {
                    // Start the component generation process
                    const task = new ProjectSetupTask({
                        description: data.content,
                        stream: data.stream || false
                    });
                    
                    taskQueue.addTask(task);
                    
                    ws.send(JSON.stringify({
                        type: 'generation_started',
                        message: 'Started component generation process'
                    }));
                } else {
                    // Handle other message types
                    switch (data.type) {
                        case 'ping':
                            ws.send(JSON.stringify({ type: 'pong' }));
                            break;
                        default:
                            console.log('Unknown message type:', data.type);
                    }
                }
            } catch (error) {
                console.error('Error handling message:', error);
                ws.send(JSON.stringify({
                    type: 'error',
                    error: error.message
                }));
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            eventEmitter.removeListener('taskUpdate', taskUpdateListener);
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        // Send initial connection success message
        try {
            ws.send(JSON.stringify({ 
                type: 'connected',
                message: 'WebSocket connection established'
            }));
        } catch (error) {
            console.error('Error sending connection message:', error);
        }
    });

    return wss;
}

module.exports = setupWebSocket;
