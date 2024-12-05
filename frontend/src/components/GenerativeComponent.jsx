import React from 'react';
import { useSelector } from 'react-redux';
import AIFlowVisualization from './GenerativeComponent/AIFlowVisualization';
import AIInteractionPanel from './GenerativeComponent/AIInteractionPanel';
import { agentOrchestrationService } from '../services/agentOrchestration';

const GenerativeComponent = () => {
  const project = useSelector((state) => state.project);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <div className="h-full">
          <AIFlowVisualization agentOrchestrationService={agentOrchestrationService} />
        </div>
      </div>
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <AIInteractionPanel />
      </div>
    </div>
  );
};

export default GenerativeComponent;
