import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaDownload } from 'react-icons/fa';
import FileTree from './FileTree';
import FilePreview from './FilePreview';
import {
  selectIsExporting,
  selectExportProgress,
  setIsExporting,
  setExportProgress,
  selectFileStructure,
  FileStructure,
} from '../../store/slices/fileGenerationSlice';

const FileGeneration: React.FC = () => {
  const dispatch = useDispatch();
  const isExporting = useSelector(selectIsExporting);
  const exportProgress = useSelector(selectExportProgress);
  const files = useSelector(selectFileStructure);

  const downloadFile = (file: FileStructure) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportProject = async () => {
    dispatch(setIsExporting(true));
    dispatch(setExportProgress(0));

    try {
      // Create a zip file containing all project files
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const addToZip = (items: FileStructure[], parentPath = '') => {
        items.forEach((item) => {
          const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name;
          
          if (item.type === 'file') {
            zip.file(itemPath, item.content);
          } else if (item.children) {
            addToZip(item.children, itemPath);
          }
        });
      };

      addToZip(files);

      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
        onUpdate: (metadata: { percent: number }) => {
          dispatch(setExportProgress(metadata.percent));
        },
      } as any) as Blob;

      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting project:', error);
    } finally {
      dispatch(setIsExporting(false));
      dispatch(setExportProgress(0));
    }
  };

  return (
    <div className="flex h-full">
      <FileTree />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            data-testid="export-button"
            onClick={exportProject}
            disabled={isExporting || files.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <FaDownload />
            <span>Export Project</span>
          </button>
          {isExporting && (
            <div data-testid="export-progress" className="ml-4">
              <progress value={exportProgress} max="100" />
              <span className="ml-2">{Math.round(exportProgress)}%</span>
            </div>
          )}
        </div>
        <FilePreview />
      </div>
    </div>
  );
};

export default FileGeneration;
