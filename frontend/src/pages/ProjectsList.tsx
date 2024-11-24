import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { MdAdd } from 'react-icons/md';

export default function ProjectsList() {
  // This would typically come from your state management
  const projects = [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform with React and Node.js',
      status: 'In Progress',
      lastUpdated: '2h ago',
    },
    {
      id: '2',
      name: 'Mobile App Backend',
      description: 'RESTful API for a mobile application',
      status: 'Planning',
      lastUpdated: '1d ago',
    },
  ];

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Projects
        </h2>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link to="/dashboard/projects/new">
            <Button className="inline-flex items-center">
              <MdAdd className="-ml-1 mr-2 h-5 w-5" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/dashboard/projects/${project.id}`}
            className="block"
          >
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Updated {project.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
