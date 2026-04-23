import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Category } from '@/lib/models/goal.models';
import { Input } from '@/shared/Input';

export default function DescriptionInput({
  activeCategory,
  onChange,
}: {
  onChange: (category: Category) => void;
  activeCategory?: Category;
}) {
  const t = useTranslations();
  const [error, setError] = useState('');
  const handleDescriptionChange = useCallback((value: string) => {
    if (!activeCategory) return;
    if (!value || !value.trim()) {
      return setError('CoachDetails.Config.GoalVisionPage.CategoriesManager.errors.descriprtionRequired');
    }

    onChange({ ...activeCategory, description: value.trim() || activeCategory.description });
  }, []);

  return (
    <div className="flex flex-grow flex-col gap-y-1">
      <Input
        labelKey="CoachDetails.Config.GoalVisionPage.CategoriesManager.topicDescriptionLable"
        id={'decription-input'}
        placeholder="Add topic description"
        className="flex-grow gap-y-2"
        type="textarea"
        disabled={!activeCategory}
        initialValue={activeCategory?.description ?? ''}
        inputClassName="border-storm-gray bg-transparent text-light-gray py-2.5 line-clamp-2 rounded-xl min-h-[4.5rem] text-base disabled:animate-none disabled:opacity-30"
        labelClassName="text-sm"
        onChange={(e) => handleDescriptionChange(e.target.value)}
        onBlur={(e) => handleDescriptionChange(e.target.value)}
      />
      {error && <p className="text-sm text-salmon">{t(error)}</p>}
    </div>
  );
}
