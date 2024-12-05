import React, { useState } from 'react';
import ChangePasswordModal from '../../components/Settings/ChangePasswordModal';
import ConfirmationModal from '../../components/Settings/ConfirmationModal';

const Settings: React.FC = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOpenAIModal, setShowOpenAIModal] = useState(false);
  const [showAnthropicModal, setShowAnthropicModal] = useState(false);

  // Dummy data - in real app would come from user context/state
  const userEmail = "user@example.com";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      
      {/* User Information Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex gap-4">
              <input
                type="password"
                value="••••••••"
                disabled
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">API Keys</h2>
        
        <div className="space-y-4">
          {/* OpenAI API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <button
                onClick={() => setShowOpenAIModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Key
              </button>
            </div>
          </div>

          {/* Anthropic API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anthropic API Key
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
              <button
                onClick={() => setShowAnthropicModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Key
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
      
      <ConfirmationModal
        isOpen={showOpenAIModal}
        onClose={() => setShowOpenAIModal(false)}
        onConfirm={() => {
          // Handle OpenAI key update logic here
          setShowOpenAIModal(false);
        }}
        title="Update OpenAI API Key"
        description="Are you sure you want to update your OpenAI API key? This will affect all AI operations using OpenAI services."
      />

      <ConfirmationModal
        isOpen={showAnthropicModal}
        onClose={() => setShowAnthropicModal(false)}
        onConfirm={() => {
          // Handle Anthropic key update logic here
          setShowAnthropicModal(false);
        }}
        title="Update Anthropic API Key"
        description="Are you sure you want to update your Anthropic API key? This will affect all AI operations using Anthropic services."
      />
    </div>
  );
};

export default Settings;
