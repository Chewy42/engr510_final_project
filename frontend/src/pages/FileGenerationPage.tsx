import React from 'react';
import FileGeneration from '../components/FileGeneration/FileGeneration';

const FileGenerationPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">File Generation</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Preview and export your generated project files.
        </p>
      </div>
      <div className="flex-1">
        <FileGeneration />
      </div>
    </div>
  );
};

export default FileGenerationPage;
