import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MdPlayArrow, MdStop } from 'react-icons/md';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  // This would typically come from your state management
  const project = {
    id,
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    status: 'In Progress',
    lastUpdated: '2h ago',
    prompt: 'Create a modern e-commerce platform with React frontend and Node.js backend. Include features for product listing, shopping cart, and checkout.',
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {project.name}
          </h2>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Button className="inline-flex items-center mr-3" variant="secondary">
              <MdStop className="-ml-1 mr-2 h-5 w-5" />
              Stop Generation
            </Button>
            <Button className="inline-flex items-center">
              <MdPlayArrow className="-ml-1 mr-2 h-5 w-5" />
              Start Generation
            </Button>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">{project.description}</p>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Project Details
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.status}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.lastUpdated}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Project Prompt</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.prompt}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* The AIInteractionPanel with React Flow will be shown here via the DashboardLayout when on a project page */}
    </div>
  );
}
