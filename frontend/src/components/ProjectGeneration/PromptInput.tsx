import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProjectGeneration } from '../../store/slices/projectGenerationSlice';
import { colors, transitions, shadows } from '../../styles/materialTheme';

interface PromptInputProps {
  onSubmit: (variables: Record<string, string>) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit }) => {
  const { selectedTemplate, generationStatus } = useSelector(selectProjectGeneration);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(variables);
  };

  const handleInputChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value,
    }));
    setTouched(prev => ({
      ...prev,
      [variable]: true,
    }));
  };

  const handleBlur = (variable: string) => {
    setTouched(prev => ({
      ...prev,
      [variable]: true,
    }));
  };

  if (!selectedTemplate) {
    return null;
  }

  const isFormValid = selectedTemplate.variables.every(
    variable => variables[variable]?.trim()
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Project Details</h2>
        <p className="text-gray-600">
          Provide the following information to customize your project
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {selectedTemplate.variables.map((variable: string) => {
            const isEmpty = !variables[variable]?.trim();
            const showError = touched[variable] && isEmpty;

            return (
              <div key={variable} className="space-y-2">
                <label
                  htmlFor={variable}
                  className="block text-sm font-medium text-gray-700"
                >
                  {variable.charAt(0).toUpperCase() + variable.slice(1)}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id={variable}
                    value={variables[variable] || ''}
                    onChange={(e) => handleInputChange(variable, e.target.value)}
                    onBlur={() => handleBlur(variable)}
                    className={`
                      w-full px-4 py-3 rounded-lg border
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${
                        showError
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }
                    `}
                    rows={3}
                    placeholder={`Enter ${variable.toLowerCase()}...`}
                    aria-invalid={showError}
                    aria-describedby={showError ? `${variable}-error` : undefined}
                  />
                  {showError && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id={`${variable}-error`}
                      role="alert"
                    >
                      This field is required
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!isFormValid || generationStatus === 'loading'}
            className={`
              w-full flex justify-center py-3 px-4 rounded-lg
              text-white font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                isFormValid && generationStatus !== 'loading'
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            {generationStatus === 'loading' ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating Project...
              </div>
            ) : (
              'Generate Project'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;
