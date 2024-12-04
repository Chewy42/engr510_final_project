import React from 'react';
import { useSelector } from 'react-redux';
import { selectProjectGeneration } from '../../store/slices/projectGenerationSlice';
import { colors, transitions } from '../../styles/materialTheme';

const ProgressIndicator: React.FC = () => {
  const { progress, currentStep, generationStatus, error } = useSelector(selectProjectGeneration);

  if (generationStatus === 'idle') {
    return null;
  }

  const getStatusColor = () => {
    switch (generationStatus) {
      case 'loading':
        return 'bg-blue-500';
      case 'succeeded':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (generationStatus) {
      case 'loading':
        return 'Generating';
      case 'succeeded':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Processing';
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-lg p-6">
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                generationStatus === 'loading'
                  ? 'bg-blue-100 text-blue-800'
                  : generationStatus === 'succeeded'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {getStatusText()}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full transition-all duration-500 ease-out ${getStatusColor()}`}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Current Step */}
        {currentStep && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Current Step:</span>{' '}
            <span className="text-gray-700">{currentStep}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error occurred during generation
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {generationStatus === 'succeeded' && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Project generated successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  Your project has been created and is ready to use.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;
