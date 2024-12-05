import { Node, Edge } from 'reactflow';

interface Artifact {
  id: string;
  type: string;
  content: any;
  dependencies?: string[];
}

const NODE_TYPES = {
  requirement: 'requirement',
  architecture: 'architecture',
  timeline: 'timeline',
  risk: 'risk',
} as const;

type NodeType = keyof typeof NODE_TYPES;

const getNodeType = (artifactType: string): NodeType => {
  const type = artifactType.toLowerCase();
  return (NODE_TYPES[type as NodeType] || 'requirement') as NodeType;
};

const validatePosition = (position: { x: number; y: number }) => {
  if (typeof position.x !== 'number' || typeof position.y !== 'number') {
    throw new Error('Invalid node position');
  }
  return position;
};

export const calculateNodePositions = (artifacts: Artifact[]) => {
  const VERTICAL_SPACING = 150;
  const HORIZONTAL_SPACING = 300;
  const INITIAL_OFFSET = { x: 50, y: 50 };
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  artifacts.forEach((artifact, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    const position = validatePosition({
      x: INITIAL_OFFSET.x + (col * HORIZONTAL_SPACING),
      y: INITIAL_OFFSET.y + (row * VERTICAL_SPACING)
    });

    const nodeType = getNodeType(artifact.type);
    
    nodes.push({
      id: artifact.id,
      type: nodeType,
      position,
      data: {
        ...artifact.content,
        label: artifact.content.title || artifact.type,
      }
    });

    if (artifact.dependencies) {
      artifact.dependencies.forEach(depId => {
        edges.push({
          id: `${artifact.id}-${depId}`,
          source: depId,
          target: artifact.id,
          type: 'smoothstep',
          animated: true,
        });
      });
    }
  });

  return { nodes, edges };
};
