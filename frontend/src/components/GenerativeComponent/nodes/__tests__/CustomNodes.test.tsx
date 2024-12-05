import React from 'react';
import { render, screen } from '@testing-library/react';
import { RequirementNode, ArchitectureNode, TimelineNode, RiskNode } from '../CustomNodes';

// Mock XYFlow's Handle component
jest.mock('@xyflow/react', () => ({
  Handle: () => null,
  Position: {
    Top: 'top',
    Bottom: 'bottom'
  },
  ReactFlowProvider: ({ children }) => children
}));

describe('CustomNodes', () => {
  describe('RequirementNode', () => {
    const mockData = {
      id: 'req-1',
      type: 'requirement',
      title: 'Test Requirement',
      description: 'Test Description',
      priority: 'high' as const,
      category: 'Testing'
    };

    it('renders requirement node with correct content', () => {
      render(<RequirementNode data={mockData} />);
      
      expect(screen.getByText(mockData.title)).toBeInTheDocument();
      expect(screen.getByText(mockData.description)).toBeInTheDocument();
      expect(screen.getByText(mockData.priority)).toBeInTheDocument();
      expect(screen.getByText(mockData.category)).toBeInTheDocument();
    });

    it('applies correct styling based on priority', () => {
      render(<RequirementNode data={mockData} />);
      const priorityElement = screen.getByText(mockData.priority);
      expect(priorityElement).toHaveClass('bg-red-100', 'text-red-800');
    });
  });

  describe('ArchitectureNode', () => {
    const mockData = {
      id: 'arch-1',
      type: 'architecture',
      title: 'Test Architecture',
      description: 'Test Description',
      component: 'Test Component',
      dependencies: ['req-1']
    };

    it('renders architecture node with correct content', () => {
      render(<ArchitectureNode data={mockData} />);
      
      expect(screen.getByText(mockData.title)).toBeInTheDocument();
      expect(screen.getByText(mockData.description)).toBeInTheDocument();
      expect(screen.getByText(mockData.component)).toBeInTheDocument();
    });
  });

  describe('TimelineNode', () => {
    const mockData = {
      id: 'time-1',
      type: 'timeline',
      title: 'Test Timeline',
      description: 'Test Description',
      duration: 5,
      dependencies: ['arch-1']
    };

    it('renders timeline node with correct content', () => {
      render(<TimelineNode data={mockData} />);
      
      expect(screen.getByText(mockData.title)).toBeInTheDocument();
      expect(screen.getByText(mockData.description)).toBeInTheDocument();
      expect(screen.getByText(`Duration: ${mockData.duration} days`)).toBeInTheDocument();
    });
  });

  describe('RiskNode', () => {
    const mockData = {
      id: 'risk-1',
      type: 'risk',
      title: 'Test Risk',
      description: 'Test Description',
      impact: 'high' as const,
      probability: 'medium' as const,
      mitigation: 'Test mitigation strategy'
    };

    it('renders risk node with correct content', () => {
      render(<RiskNode data={mockData} />);
      
      expect(screen.getByText(mockData.title)).toBeInTheDocument();
      expect(screen.getByText(mockData.description)).toBeInTheDocument();
      expect(screen.getByText(`Impact: ${mockData.impact}`)).toBeInTheDocument();
      expect(screen.getByText(`Prob: ${mockData.probability}`)).toBeInTheDocument();
      expect(screen.getByText(`Mitigation: ${mockData.mitigation}`)).toBeInTheDocument();
    });

    it('applies correct styling based on impact and probability', () => {
      render(<RiskNode data={mockData} />);
      
      const impactElement = screen.getByText(`Impact: ${mockData.impact}`);
      const probElement = screen.getByText(`Prob: ${mockData.probability}`);
      
      expect(impactElement).toHaveClass('bg-red-100', 'text-red-800');
      expect(probElement).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });
  });
});
