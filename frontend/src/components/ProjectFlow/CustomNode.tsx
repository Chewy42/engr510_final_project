import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  type: string;
  description?: string;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border border-gray-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="ml-2">
            <div className="text-lg font-bold text-gray-900">{data.label}</div>
            <div className="text-sm text-gray-500">{data.type}</div>
          </div>
        </div>
        {data.description && (
          <div className="mt-2 text-sm text-gray-600">{data.description}</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default memo(CustomNode);
