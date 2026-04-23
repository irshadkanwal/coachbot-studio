import { useCallback, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { useSubmitOnEnter } from '@/hooks/useSubmitOnEnter';
import { Button } from '@/shared/Button';
import { Input } from '@/shared/Input';
import { EditableCategory } from './CategoriesManager';

export default function CategoryPanel({
  id,
  category,
  categories,
  isDisabled,
  onUpdate,
}: {
  id: string;
  category: EditableCategory;
  categories: EditableCategory[];
  isDisabled?: boolean;
  onUpdate: (categories: EditableCategory[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDelete = useCallback(
    (targetCategory: EditableCategory) => onUpdate(categories.filter(({ id }) => id !== targetCategory.id)),
    [categories]
  );

  const handleEditClicked = useCallback(
    (targetCategory: EditableCategory) => {
      const updatedCategories = categories.map((category: EditableCategory) => ({
        ...category,
        isEditing: category.id === targetCategory.id,
      }));

      if (inputRef.current) {
        inputRef.current.focus();
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }

      onUpdate(updatedCategories);
    },
    [categories, inputRef.current]
  );

  const handleEdit = useCallback(
    (newName: string) => {
      const updatedCategories = categories.map((c: EditableCategory) => {
        if (category.id !== c.id) return c;

        const name = newName.trim() || c.name;
        inputRef.current && (inputRef.current.value = name);

        return { ...c, name, isEditing: false };
      });

      onUpdate(updatedCategories);
    },
    [categories]
  );

  const handleKeyDown = useSubmitOnEnter(() => handleEdit(inputRef.current?.value || ''), false);

  return (
    <div
      className={twMerge(
        `${id}-label-content group flex h-full max-w-full flex-grow cursor-pointer items-center justify-between gap-x-2 overflow-hidden text-nowrap rounded-full border border-transparent bg-graphic/[14%] p-3.5 text-base text-light-gray hover:border-main hover:text-main`,
        category.active && 'border-main bg-transparent text-main'
      )}
    >
      <Input
        ref={inputRef}
        readOnly={!category.isEditing}
        id={`category-${category.id}`}
        name={`category-${category.id}`}
        className="flex flex-grow flex-row gap-x-2"
        inputClassName={twMerge(
          'line-clamp-1 inline-block w-[75%] overflow-hidden text-ellipsis text-nowrap ps-1 w-full border-none bg-transparent text-base focus:outline-none',
          category.isEditing ? 'border-dark-aquamarine ' : 'cursor-default pointer-events-none'
        )}
        placeholder={`Category name`}
        initialValue={category.name}
        onBlur={(e) => !e.target.contains(e.relatedTarget) && handleEdit(e.target.value)}
        onKeyDown={handleKeyDown}
      >
        {!category.isEditing && !isDisabled && (
          <div
            className={twMerge(
              'flex gap-x-2 text-storm-gray group-hover:text-light-gray',
              category.active && 'text-light-gray'
            )}
          >
            <Button
              type="button"
              className="cbi-edit-2 p-0 text-lg hover:text-main"
              onClick={() => handleEditClicked(category)}
            />
            <Button
              type="button"
              className="cbi-trash p-0 text-lg hover:text-main disabled:opacity-20"
              onClick={() => handleDelete(category)}
            />
          </div>
        )}
      </Input>
    </div>
  );
}
