import { useActionState } from 'react';

interface UseAuthFormActionOptions {
  onSubmit: (formData: FormData) => Promise<void>;
  getErrorMessage: (error: unknown) => string;
}

type UseAuthFormActionReturn = [
  error: string | null,
  submitAction: (formData: FormData) => void,
  isPending: boolean,
];

export function useAuthFormAction({
  onSubmit,
  getErrorMessage,
}: UseAuthFormActionOptions): UseAuthFormActionReturn {
  return useActionState(
    async (_previousState: string | null, formData: FormData): Promise<string | null> => {
      try {
        await onSubmit(formData);
        return null;
      } catch (error) {
        return getErrorMessage(error);
      }
    },
    null
  );
}
