import { useCallback } from 'react';

export function useSubmitOnEnter(
  onSubmit: (event?: React.KeyboardEvent) => void,
  isSubmitting: boolean
): (event: React.KeyboardEvent) => void {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (!isSubmitting) {
          onSubmit(event);
        }
      }
    },
    [onSubmit, isSubmitting]
  );

  return handleKeyDown;
}
