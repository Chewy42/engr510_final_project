import React from 'react';
import { FaFolder, FaFolderOpen, FaFile } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectFile,
  selectSelectedFile,
  selectFileStructure,
  FileStructure,
} from '../../store/slices/fileGenerationSlice';

interface FileTreeItemProps {
  item: FileStructure;
  level: number;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ item, level }) => {
  const dispatch = useDispatch();
  const selectedFile = useSelector(selectSelectedFile);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    if (item.type === 'directory') {
      setIsOpen(!isOpen);
    } else {
      dispatch(selectFile(item.path));
    }
  };

  return (
    <div className="select-none">
      <div
        data-testid="file-tree-item"
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
          selectedFile === item.path ? 'bg-blue-50 dark:bg-gray-600' : ''
        }`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleClick}
      >
        <span className="mr-2">
          {item.type === 'directory' ? (
            isOpen ? <FaFolderOpen className="text-yellow-500" /> : <FaFolder className="text-yellow-500" />
          ) : (
            <FaFile className="text-gray-500" />
          )}
        </span>
        <span>{item.name}</span>
      </div>
      {item.type === 'directory' && isOpen && item.children && (
        <div>
          {item.children.map((child: FileStructure, index: number) => (
            <FileTreeItem key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileTreeProps {
  files: FileStructure[];
}

const FileTree: React.FC<FileTreeProps> = ({ files }) => {
  return (
    <div data-testid="file-tree" className="w-64 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Project Files</h2>
        {files.map((item, index) => (
          <FileTreeItem key={index} item={item} level={0} />
        ))}
      </div>
    </div>
  );
};

export default FileTree;
