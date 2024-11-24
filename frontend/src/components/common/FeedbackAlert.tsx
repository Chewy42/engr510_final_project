import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface FeedbackAlertProps {
  type: 'error' | 'warning' | 'success' | 'info';
  messages: string[];
  onDismiss?: () => void;
}

const alertStyles = {
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  success: 'bg-green-50 text-green-800 border-green-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

const iconStyles = {
  error: 'text-red-400',
  warning: 'text-yellow-400',
  success: 'text-green-400',
  info: 'text-blue-400',
};

export const FeedbackAlert: React.FC<FeedbackAlertProps> = ({
  type,
  messages,
  onDismiss,
}) => {
  if (!messages.length) return null;

  return (
    <div
      className={`rounded-md border p-4 mb-4 ${alertStyles[type]}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-1">
          {messages.map((message, index) => (
            <div key={index} className="text-sm">
              {message}
            </div>
          ))}
        </div>
        {onDismiss && (
          <button
            type="button"
            className={`ml-3 inline-flex ${iconStyles[type]}`}
            onClick={onDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};
