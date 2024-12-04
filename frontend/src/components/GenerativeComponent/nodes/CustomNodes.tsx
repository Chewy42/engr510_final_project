import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface CustomNodeProps {
  data: {
    title: string;
    description: string;
    [key: string]: any;
  };
}

const nodeStyles = {
  padding: '10px',
  borderRadius: '5px',
  minWidth: '150px',
  backgroundColor: 'white',
  border: '1px solid #ddd',
};

export const RequirementNode: React.FC<CustomNodeProps> = ({ data }) => (
  <div style={{ ...nodeStyles, borderLeft: '4px solid #2196f3' }}>
    <Handle type="target" position={Position.Top} />
    <div className="font-semibold">{data.title}</div>
    <div className="text-sm">{data.description}</div>
    <div className="text-xs mt-2">
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
        Priority: {data.priority}
      </span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export const ArchitectureNode: React.FC<CustomNodeProps> = ({ data }) => (
  <div style={{ ...nodeStyles, borderLeft: '4px solid #4caf50' }}>
    <Handle type="target" position={Position.Top} />
    <div className="font-semibold">{data.title}</div>
    <div className="text-sm">{data.description}</div>
    <div className="text-xs mt-2">
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
        Component: {data.component}
      </span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export const TimelineNode: React.FC<CustomNodeProps> = ({ data }) => (
  <div style={{ ...nodeStyles, borderLeft: '4px solid #ff9800' }}>
    <Handle type="target" position={Position.Top} />
    <div className="font-semibold">{data.title}</div>
    <div className="text-sm">{data.description}</div>
    <div className="text-xs mt-2">
      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
        Duration: {data.duration} days
      </span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export const RiskNode: React.FC<CustomNodeProps> = ({ data }) => (
  <div style={{ ...nodeStyles, borderLeft: '4px solid #f44336' }}>
    <Handle type="target" position={Position.Top} />
    <div className="font-semibold">{data.title}</div>
    <div className="text-sm">{data.description}</div>
    <div className="text-xs mt-2 flex gap-2">
      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
        Impact: {data.impact}
      </span>
      <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
        Probability: {data.probability}
      </span>
    </div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);
