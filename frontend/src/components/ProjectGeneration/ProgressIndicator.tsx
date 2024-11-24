import React from 'react';
import { useSelector } from 'react-redux';
import { selectProjectGeneration } from '../../store/slices/projectGenerationSlice';

const ProgressIndicator: React.FC = () => {
  const { progress, currentStep, generationStatus, error } = useSelector(selectProjectGeneration);

  if (generationStatus === 'idle') {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              {generationStatus === 'loading' ? 'Generating' : generationStatus}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
          />
        </div>
      </div>

      {currentStep && (
        <div className="text-sm text-gray-600">
          Current Step: {currentStep}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          Error: {error}
        </div>
      )}

      {generationStatus === 'succeeded' && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
          Project generation completed successfully!
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
