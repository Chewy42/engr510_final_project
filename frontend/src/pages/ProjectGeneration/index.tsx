import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store';
import {
  generateProject,
  selectProjectGeneration,
  resetState,
} from '../../store/slices/projectGenerationSlice';
import TemplateSelector from '../../components/ProjectGeneration/TemplateSelector';
import PromptInput from '../../components/ProjectGeneration/PromptInput';
import ProgressIndicator from '../../components/ProjectGeneration/ProgressIndicator';
import { colors, spacing } from '../../styles/materialTheme';

const ProjectGenerationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedTemplate, generationStatus } = useSelector(selectProjectGeneration);

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  const handleGenerateProject = async (variables: Record<string, string>) => {
    if (!selectedTemplate) return;

    try {
      const result = await dispatch(
        generateProject({
          template: selectedTemplate.id,
          variables,
        })
      ).unwrap();

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to generate project:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create New Project
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose a template and customize your project settings to get started
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-12">
              {/* Template Selection */}
              <section className="pb-8 border-b border-gray-200">
                <TemplateSelector />
              </section>

              {/* Project Configuration */}
              {selectedTemplate && (
                <section className="pt-4">
                  <PromptInput onSubmit={handleGenerateProject} />
                </section>
              )}

              {/* Progress Indicator */}
              {generationStatus !== 'idle' && (
                <section className="pt-4">
                  <ProgressIndicator />
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGenerationPage;
