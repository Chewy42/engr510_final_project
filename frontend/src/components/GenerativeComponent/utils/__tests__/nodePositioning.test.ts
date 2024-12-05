import { calculateNodePositions } from '../nodePositioning';

describe('calculateNodePositions', () => {
  const mockArtifacts = [
    {
      id: '1',
      type: 'requirement',
      content: {
        title: 'Requirement 1',
        description: 'Test requirement'
      }
    },
    {
      id: '2',
      type: 'architecture',
      content: {
        title: 'Architecture 1',
        description: 'Test architecture'
      },
      dependencies: ['1']
    }
  ];

  it('should create nodes with valid positions', () => {
    const { nodes, edges } = calculateNodePositions(mockArtifacts);
    
    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);
    
    // Check node positions
    nodes.forEach(node => {
      expect(node.position).toBeDefined();
      expect(typeof node.position.x).toBe('number');
      expect(typeof node.position.y).toBe('number');
    });
  });

  it('should assign correct node types', () => {
    const { nodes } = calculateNodePositions(mockArtifacts);
    
    expect(nodes[0].type).toBe('requirement');
    expect(nodes[1].type).toBe('architecture');
  });

  it('should create edges for dependencies', () => {
    const { edges } = calculateNodePositions(mockArtifacts);
    
    expect(edges[0]).toEqual({
      id: '2-1',
      source: '1',
      target: '2',
      type: 'smoothstep',
      animated: true,
    });
  });

  it('should handle empty artifacts array', () => {
    const { nodes, edges } = calculateNodePositions([]);
    
    expect(nodes).toHaveLength(0);
    expect(edges).toHaveLength(0);
  });

  it('should handle unknown node types', () => {
    const { nodes } = calculateNodePositions([{
      id: '1',
      type: 'unknown',
      content: {
        title: 'Unknown Node'
      }
    }]);
    
    expect(nodes[0].type).toBe('requirement');
  });
});
