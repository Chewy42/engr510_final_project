import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { useAppDispatch } from '../store/hooks';
import { fetchProjects } from '../store/slices/projectSlice';
import { MdDashboard, MdAccessTime, MdAdd } from 'react-icons/md';
import { Button, Typography } from '@mui/material';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const { projects, isLoading, error } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await dispatch(fetchProjects()).unwrap();
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
    loadProjects();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="pb-5 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-4xl font-medium text-gray-900 transition-all duration-300 ease-in-out hover:text-gray-700">
            Welcome{auth.user?.email ? `, ${auth.user.email}` : ''}
          </h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<MdAdd />}
            onClick={() => navigate('/dashboard/new-project')}
          >
            New Project
          </Button>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Stats cards */}
            <div className="bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MdDashboard className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Projects
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 mt-1">
                        {projects.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MdAccessTime className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Tasks Due Today
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900 mt-1">
                        {/* Replace with actual tasks count */}
                        0
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="mt-8">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Your Projects</h2>
          {error && (
            <div className="mt-4">
              <Typography color="error">
                {error}
              </Typography>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-3 text-center text-gray-500">Loading projects...</div>
            ) : error ? (
              <div className="col-span-3 text-center text-red-500">
                {error}
              </div>
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white overflow-hidden shadow-sm rounded-xl transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/dashboard/project/${project.id}`)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No projects yet. Click "New Project" to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
