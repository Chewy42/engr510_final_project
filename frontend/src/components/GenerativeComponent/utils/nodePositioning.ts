import { Node, Edge } from 'reactflow';

interface Artifact {
  id: string;
  type: string;
  content: any;
  dependencies?: string[];
}

export const calculateNodePositions = (artifacts: Artifact[]) => {
  const VERTICAL_SPACING = 150;
  const HORIZONTAL_SPACING = 300;
  
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  artifacts.forEach((artifact, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    nodes.push({
      id: artifact.id,
      type: 'custom',
      position: { 
        x: col * HORIZONTAL_SPACING, 
        y: row * VERTICAL_SPACING 
      },
      data: {
        ...artifact.content,
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
