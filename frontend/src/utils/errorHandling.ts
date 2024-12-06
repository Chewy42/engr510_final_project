import { SerializedError } from '@reduxjs/toolkit';
import { APIError } from '../services/api';

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof APIError) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }

  // Handle Redux toolkit's SerializedError
  if (error && typeof error === 'object') {
    const serializedError = error as SerializedError;
    return serializedError.message || 
           serializedError.code || 
           'An unexpected error occurred';
  }

  return 'An unexpected error occurred';
};
