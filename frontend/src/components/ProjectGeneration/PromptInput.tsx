import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProjectGeneration } from '../../store/slices/projectGenerationSlice';

interface PromptInputProps {
  onSubmit: (variables: Record<string, string>) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit }) => {
  const { selectedTemplate } = useSelector(selectProjectGeneration);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(variables);
  };

  const handleInputChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value,
    }));
  };

  if (!selectedTemplate) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {selectedTemplate.variables.map((variable: string) => (
          <div key={variable}>
            <label
              htmlFor={variable}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {variable.charAt(0).toUpperCase() + variable.slice(1)}
            </label>
            <textarea
              id={variable}
              value={variables[variable] || ''}
              onChange={(e) => handleInputChange(variable, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder={`Enter ${variable}...`}
              required
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate Project
        </button>
      </div>
    </form>
  );
};

export default PromptInput;
