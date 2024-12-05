const WebSocket = require('ws');
const taskQueue = require('./services/queue.service');
const { eventEmitter, ProjectSetupTask } = require('./services/tasks.service');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server, path: '/ws' });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection established');

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
                        ws.send(JSON.stringify({
                            type: 'error',
                            error: error.message
                        }));
                    }
                } else {
                    // Handle regular updates
                    ws.send(JSON.stringify({
                        type: 'task_update',
                        ...update
                    }));
                }
            }
        };

        eventEmitter.on('taskUpdate', taskUpdateListener);

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                console.log('Received:', data);
                
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
        ws.send(JSON.stringify({ type: 'connected' }));
    });

    return wss;
}

module.exports = setupWebSocket;
