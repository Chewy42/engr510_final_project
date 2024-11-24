import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  generateProject,
  selectProjectGeneration,
  resetState,
} from '../../store/slices/projectGenerationSlice';
import TemplateSelector from '../../components/ProjectGeneration/TemplateSelector';
import PromptInput from '../../components/ProjectGeneration/PromptInput';
import ProgressIndicator from '../../components/ProjectGeneration/ProgressIndicator';

const ProjectGenerationPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTemplate, generationStatus } = useSelector(selectProjectGeneration);

  useEffect(() => {
    // Reset state when component mounts
    dispatch(resetState());
  }, [dispatch]);

  const handleGenerateProject = async (variables: Record<string, string>) => {
    if (!selectedTemplate) return;

    try {
      await dispatch(
        generateProject({
          template: selectedTemplate.id,
          variables,
        })
      ).unwrap();

      // Navigate to project view or dashboard after successful generation
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to generate project:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate New Project</h1>
          <p className="mt-2 text-gray-600">
            Choose a template and provide project requirements to generate your project
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 space-y-8">
          <TemplateSelector />

          {selectedTemplate && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Project Requirements
              </h3>
              <PromptInput onSubmit={handleGenerateProject} />
            </div>
          )}

          <div className="border-t pt-6">
            <ProgressIndicator />
          </div>
        </div>

        {generationStatus === 'succeeded' && (
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              View Generated Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGenerationPage;
