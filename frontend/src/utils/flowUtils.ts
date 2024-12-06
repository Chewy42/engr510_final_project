import { Node, Edge } from 'reactflow';

export const calculateNodePositions = (nodes: Node[], edges: Edge[]): Node[] => {
  // Simple layout algorithm - positions nodes in a grid
  const HORIZONTAL_SPACING = 200;
  const VERTICAL_SPACING = 100;
  const NODES_PER_ROW = 3;

  return nodes.map((node, index) => {
    const row = Math.floor(index / NODES_PER_ROW);
    const col = index % NODES_PER_ROW;

    return {
      ...node,
      position: {
        x: col * HORIZONTAL_SPACING,
        y: row * VERTICAL_SPACING
      }
    };
  });
};
