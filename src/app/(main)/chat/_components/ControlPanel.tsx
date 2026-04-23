'use client';

import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useSubmitOnEnter } from '@/hooks/useSubmitOnEnter';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';

export default function ControlPanel({ onSendMessage }: { onSendMessage?: (message: string) => Promise<void> }) {
  const {
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors, isLoading, isSubmitting },
  } = useForm();
  const formValues = watch();
  const isDisabled = useMemo(() => !!errors.message || isLoading || isSubmitting, [errors, isLoading, isSubmitting]);

  const onSubmit = useCallback(
    async ({ message }: any) => {
      setValue('message', '');

      onSendMessage && (await onSendMessage(message));
    },
    [onSendMessage]
  );

  const handleKeyDown = useSubmitOnEnter(() => handleSubmit(onSubmit)(), isSubmitting);

  return (
    <div className="z-10 flex shrink-0 gap-x-5">
      <form
        className="flex flex-grow flex-row items-end gap-x-2 py-0.5"
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          id="chat-input"
          type="textarea"
          isSubmitting={isSubmitting}
          initialValue={formValues.message}
          placeholderKey="Chat.inputPlaceholder"
          disablePalaceholderKey="Chat.loadingInputPlaceholder"
          className="textarea flex-grow overflow-hidden rounded-lg"
          inputClassName="h-full resize-none overflow-y-auto max-h-[3.6em] line-height-[1.2em]"
          {...register('message')}
        />

        <Button
          variant="solid"
          color="primary"
          type="submit"
          className={twMerge('cbi-send h-max px-4 py-2.5 text-2xl')}
          disabled={isDisabled}
        />
      </form>
    </div>
  );
}
