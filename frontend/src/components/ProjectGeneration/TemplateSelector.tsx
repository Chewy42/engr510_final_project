import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTemplate, selectProjectGeneration } from '../../store/slices/projectGenerationSlice';
import type { Template } from '../../store/slices/projectGenerationSlice';
import { colors, transitions, shadows } from '../../styles/materialTheme';

const TemplateSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { templates, selectedTemplate } = useSelector(selectProjectGeneration);

  const handleTemplateSelect = (templateId: string) => {
    dispatch(selectTemplate(templateId));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template: Template) => (
          <div
            key={template.id}
            className={`
              relative p-6 rounded-lg cursor-pointer
              transition-all duration-300 ease-in-out
              transform hover:-translate-y-1
              ${
                selectedTemplate?.id === template.id
                  ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                  : 'border border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }
            `}
            onClick={() => handleTemplateSelect(template.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleTemplateSelect(template.id);
              }
            }}
            aria-selected={selectedTemplate?.id === template.id}
            aria-label={`Select ${template.name} template`}
          >
            {/* Template Icon or Image could be added here */}
            <div className="mb-4">
              <h3 className="text-xl font-medium text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{template.description}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Required Information:</h4>
              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable) => (
                  <span
                    key={variable}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>

            {selectedTemplate?.id === template.id && (
              <div className="absolute top-4 right-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
