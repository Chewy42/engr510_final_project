import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addMessage } from '../../store/slices/aiSlice';
import { resetAIAssistantVisibility } from '../../store/slices/uiSlice';
import { wsService } from '../../services/wsInstance';

const AIInteractionPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const { messages, isProcessing, wsConnected } = useSelector((state: RootState) => state.ai);

  useEffect(() => {
    wsService.connect();
    // Cleanup function
    return () => {
      wsService.disconnect();
      dispatch(resetAIAssistantVisibility());
    };
  }, [dispatch]);

  const handleSend = () => {
    if (!input.trim()) return;

    const message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user' as const,
      timestamp: Date.now(),
    };

    dispatch(addMessage(message));
    wsService.sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex flex-col p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AI Assistant</h2>
          <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <div className="flex-1 min-h-[200px] bg-gray-50 rounded-md p-4 mb-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-blue-100 ml-auto' 
                  : msg.sender === 'system'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100'
              } max-w-[80%]`}
            >
              {msg.content}
            </div>
          ))}
          {isProcessing && (
            <div className="text-gray-500 italic">AI is thinking...</div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIInteractionPanel;
