const WebSocket = require('ws');
const taskQueue = require('./services/queue.service');
const { eventEmitter, ProjectSetupTask } = require('./services/tasks.service');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    // Set up task update listener for this connection
    const taskUpdateListener = (update) => {
      ws.send(JSON.stringify({
        type: 'task_update',
        ...update
      }));
    };

    eventEmitter.on('taskUpdate', taskUpdateListener);

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received:', data);
        
        if (data.content) {
          // Start the component generation process
          const task = new ProjectSetupTask({
            description: data.content
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
          content: 'Error processing your request'
        }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      eventEmitter.removeListener('taskUpdate', taskUpdateListener);
    });

    // Send initial connection success message
    ws.send(JSON.stringify({ type: 'connected' }));
  });

  return wss;
}

module.exports = setupWebSocket;
