export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateProjectInput = (
  template: string,
  variables: Record<string, string>
): ValidationResult => {
  const errors: string[] = [];

  // Template validation
  if (!template || template.trim() === '') {
    errors.push('Template selection is required');
  }

  // Variables validation
  if (!variables || Object.keys(variables).length === 0) {
    errors.push('Project variables are required');
  } else {
    Object.entries(variables).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        errors.push(`${key} is required`);
      }
      if (value && value.length > 1000) {
        errors.push(`${key} must be less than 1000 characters`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePrompt = (prompt: string): ValidationResult => {
  const errors: string[] = [];

  if (!prompt || prompt.trim() === '') {
    errors.push('Prompt is required');
  }

  if (prompt && prompt.length > 2000) {
    errors.push('Prompt must be less than 2000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
