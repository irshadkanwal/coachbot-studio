'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { State } from '@/lib/models/common.models';
import { Category } from '@/lib/models/goal.models';
import { saveCategories } from '@/server/actions/goalsActions';
import CategoryPanel from './CategoryPanel';
import DescriptionInput from './DescriptionInput';
import NewCategoryInput from './NewCategoryInput';
import { RadarChart } from './Radar';
import TopicCounter from './TopicCounter';

export type EditableCategory = Category & { active?: boolean; isEditing?: boolean };

const CREATE_CATEGORY_ID = 'create-category-placeholder';
const createPlaceholder = { id: CREATE_CATEGORY_ID } as EditableCategory;

export default function CategoriesManager({
  categories: initialCategories,
  isDisabled,
  assistantId,
}: {
  categories: Category[];
  assistantId: string;
  isDisabled?: boolean;
}) {
  const t = useTranslations();
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState<EditableCategory>();
  const [formState, setFormState] = useState<State<Category[]>>();

  const chartDataWithPlaceholder = useMemo(() => {
    return categories.length < 10 && !isDisabled ? [...categories, createPlaceholder] : categories;
  }, [categories, isDisabled]);

  const handleSelect = useCallback((item: EditableCategory) => {
    if (item.id === CREATE_CATEGORY_ID) return;

    setActiveCategory(item as EditableCategory);
    setCategories((prev) => prev.map((category) => ({ ...category, active: category.id === item.id })));
  }, []);

  const handleDescriptionChange = useCallback((updatedCategory: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)));
    handleSelect(updatedCategory);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const state = await saveCategories(assistantId, categories, initialCategories);

      setFormState(state);
    },
    [assistantId, initialCategories, categories]
  );

  const handleReset = useCallback(() => {
    setCategories(initialCategories);
    setActiveCategory(undefined);
    setFormState({});
  }, []);

  return (
    <div className="flex shrink flex-grow flex-col">
      {!isDisabled && <TopicCounter categories={categories} t={t} />}

      <form
        className="flex shrink flex-grow flex-col"
        id="goalVisionForm"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <div className="flex flex-grow flex-col">
          <div className="flex h-[43dvh] min-h-[25rem] flex-grow flex-col">
            <RadarChart
              data={chartDataWithPlaceholder}
              onClick={handleSelect}
              ignoreDataIds={[CREATE_CATEGORY_ID]}
              isDisabled={isDisabled}
            >
              {(item: any, id: string) =>
                item.id === CREATE_CATEGORY_ID ? (
                  <NewCategoryInput
                    onSubmit={(item) => {
                      setCategories((prev) => [...prev, item]);
                      handleSelect(item);
                    }}
                    categories={categories}
                  />
                ) : (
                  <CategoryPanel
                    id={id}
                    category={item}
                    categories={categories}
                    isDisabled={isDisabled}
                    onUpdate={setCategories}
                  />
                )
              }
            </RadarChart>
          </div>

          {!isDisabled && (
            <DescriptionInput
              key={activeCategory?.id}
              activeCategory={activeCategory}
              onChange={handleDescriptionChange}
            />
          )}

          {!!formState?.errors?.length &&
            formState?.errors.map((error, i) => (
              <p key={`error-${i}`} className={`pt-2 text-salmon`}>
                {t(error.message, { topic: categories[Number(error.name.toString().split('.')[0])]?.name })}
              </p>
            ))}

          {formState?.successMessage && <p className={`pt-3 text-dark-aquamarine`}>{t(formState?.successMessage)}</p>}
        </div>
      </form>
    </div>
  );
}
