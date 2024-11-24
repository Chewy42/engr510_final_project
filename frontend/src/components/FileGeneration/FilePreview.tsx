import React from 'react';
import { useSelector } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { selectPreviewContent, selectSelectedFile } from '../../store/slices/fileGenerationSlice';

const getLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const languageMap: { [key: string]: string } = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
  };
  return languageMap[ext] || 'text';
};

const FilePreview: React.FC = () => {
  const selectedFile = useSelector(selectSelectedFile);
  const previewContent = useSelector(selectPreviewContent);

  if (!selectedFile || !previewContent) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a file to preview its contents
      </div>
    );
  }

  return (
    <div data-testid="file-preview" className="flex-1 h-full overflow-auto">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{selectedFile.split('/').pop()}</h2>
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <SyntaxHighlighter
            language={getLanguage(selectedFile)}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
            showLineNumbers
          >
            {previewContent}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
