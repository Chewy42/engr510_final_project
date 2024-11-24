import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTemplate, selectProjectGeneration } from '../../store/slices/projectGenerationSlice';
import type { Template } from '../../store/slices/projectGenerationSlice';

const TemplateSelector: React.FC = () => {
  const dispatch = useDispatch();
  const { templates, selectedTemplate } = useSelector(selectProjectGeneration);

  const handleTemplateSelect = (templateId: string) => {
    dispatch(selectTemplate(templateId));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Choose a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template: Template) => (
          <div
            key={template.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
            <p className="text-gray-600 mt-1">{template.description}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Required fields: {template.variables.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
