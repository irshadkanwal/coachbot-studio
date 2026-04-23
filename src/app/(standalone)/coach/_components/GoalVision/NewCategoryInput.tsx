import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { twMerge } from 'tailwind-merge';

import { useSubmitOnEnter } from '@/hooks/useSubmitOnEnter';
import { Category } from '@/lib/models/goal.models';
import { generateUUID } from '@/lib/utils/chat.utils';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';

export default function NewCategoryInput({
  onSubmit,
  categories,
}: {
  onSubmit: (item: Category) => void;
  categories: Category[];
}) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const placeholder = useMemo(
    () => error || 'CoachDetails.Config.GoalVisionPage.CategoriesManager.newCategoryPlaceholder',
    [error]
  );

  const handleSubmit = useCallback(
    (name: string) => {
      if (!name || categories.some((cat) => cat.name.toLowerCase() === name.toLowerCase())) {
        inputRef.current && (inputRef.current.value = '');
        return setError(
          `CoachDetails.Config.GoalVisionPage.CategoriesManager.errors.${!name ? 'categoryNameRequired' : 'categoryExists'}`
        );
      }

      const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${generateUUID()}`;
      onSubmit({ id, name, description: '' });
      setError('');
    },
    [categories]
  );

  const handleKeyDown = useSubmitOnEnter(
    (e) => handleSubmit(((e?.target as HTMLInputElement)?.value || '').trim()),
    false
  );

  return (
    <Input
      ref={inputRef}
      id="newCategory"
      name="newCategory"
      inputClassName={twMerge(
        'border-dark-aquamarine bg-transparent pe-10',
        error && 'border-salmon placeholder:text-salmon/[60%]'
      )}
      placeholder={t(placeholder, { count: categories.length + 1 })}
      onBlur={() => setError('')}
      onKeyDown={(e) => {
        setError('');
        handleKeyDown(e);
      }}
    >
      <Button
        type="button"
        className={`cbi-add absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 p-0 text-2xl text-main hover:text-dark-aquamarine ${error && 'pointer-events-none opacity-30'}`}
        onClick={() => handleSubmit((inputRef.current?.value || '').trim())}
      />
    </Input>
  );
}
