import { useState } from 'react';

interface UseAuthFormFeedbackReturn {
  error: string;
  success: string;
  isLoading: boolean;
  setError: (value: string) => void;
  setSuccess: (value: string) => void;
  clearMessages: () => void;
  runWithLoading: (task: () => Promise<void>) => Promise<void>;
}

export function useAuthFormFeedback(): UseAuthFormFeedbackReturn {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const runWithLoading = async (task: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await task();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    success,
    isLoading,
    setError,
    setSuccess,
    clearMessages,
    runWithLoading,
  };
}
