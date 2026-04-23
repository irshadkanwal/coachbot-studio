import { StepSlug } from '../_components/steps/config';

export const BASE_TRANSLATION_KEY = 'NewCoachCreation.steps';

export const createFieldTranslationKeyFactory =
  (baseTranslationKey = BASE_TRANSLATION_KEY) =>
  (stepName: string, id: string, key: string): string => {
    return `${baseTranslationKey}.${stepName}.fields.${id}.${key}`;
  };

export const createFieldTranslationKey = createFieldTranslationKeyFactory();

const createFieldFactory =
  (baseTranslationKey = BASE_TRANSLATION_KEY) =>
  (stepName: StepSlug, id: string, overrides = {}) => ({
    type: 'textarea',
    id,
    placeholder: `${baseTranslationKey}.${stepName}.fields.${id}.placeholder`,
    description: `${baseTranslationKey}.${stepName}.fields.${id}.description`,
    label: `${baseTranslationKey}.${stepName}.fields.${id}.label`,
    examples: `${baseTranslationKey}.${stepName}.fields.${id}.examples`,
    ...overrides,
  });

export const createField = createFieldFactory();

const createStepFactory =
  (baseTranslationKey = BASE_TRANSLATION_KEY) =>
  (stepName: StepSlug, overrides = {}) => ({
    id: stepName,
    label: `${baseTranslationKey}.${stepName}.title`,
    question: `${baseTranslationKey}.${stepName}.question`,
    fields: [],
    ...overrides,
  });

export const createStep = createStepFactory();

export const createExamplesListFactory =
  (baseTranslationKey = BASE_TRANSLATION_KEY) =>
  (stepName: StepSlug, fieldID: string, examplesKeys: string[]): string[] => {
    const fieldTranslationKey = createFieldTranslationKeyFactory(baseTranslationKey);

    return examplesKeys?.map((example) => {
      return fieldTranslationKey(stepName, fieldID, `examples.${example}`);
    });
  };

export const createExamplesList = createExamplesListFactory();
