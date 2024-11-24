import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface UseApiWithRetryOptions {
  maxRetries?: number;
  retryDelay?: number;
}

interface UseApiWithRetryResult<T> {
  execute: (request: Promise<T>) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
  retryCount: number;
}

export const useApiWithRetry = <T>(
  options: UseApiWithRetryOptions = {}
): UseApiWithRetryResult<T> => {
  const { maxRetries = 3, retryDelay = 1000 } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(
    async (request: Promise<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);
      setRetryCount(0);

      let currentRetry = 0;

      const attemptRequest = async (): Promise<T> => {
        try {
          const response = await request;
          setIsLoading(false);
          return response;
        } catch (err) {
          const error = err as AxiosError;
          
          if (currentRetry < maxRetries && isRetryableError(error)) {
            currentRetry++;
            setRetryCount(currentRetry);
            
            await new Promise(resolve => setTimeout(resolve, retryDelay * currentRetry));
            return attemptRequest();
          }

          setError(error);
          setIsLoading(false);
          throw error;
        }
      };

      return attemptRequest();
    },
    [maxRetries, retryDelay]
  );

  return { execute, isLoading, error, retryCount };
};

const isRetryableError = (error: AxiosError): boolean => {
  // Retry on network errors or 5xx server errors
  if (!error.response) return true;
  const status = error.response.status;
  return status >= 500 && status <= 599;
};
