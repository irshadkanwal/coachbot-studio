import { Assistant, AssistantPayload, AssistantPrice } from '../models/assistant.models';
import { Category } from '../models/goal.models';
import { getArraysDiff } from './array.utils';

export const getAssistantPayload = (
  { id, name, description, configuration, user, accessMode, meta }: Assistant,
  pictureUrl: string | null
): AssistantPayload => {
  const { accessLevel, visibility, revenueEnabled, tokensLimit, usageType, communicationModes, sms, whatsapp } =
    meta || {};
  const { instructions, stages } = configuration || {};
  const { id: _, assistantMetaId: __, ...price } = meta?.price || {};

  return {
    id,
    name,
    description,
    price: price as AssistantPrice,
    authorData: { id: user?.id, name: user?.name, email: user?.email, pictureUrl },
    meta: { accessLevel, visibility, revenueEnabled, sms, whatsapp },
    configuration: {
      mode: accessMode,
      instructions,
      tokensLimit,
      usageType,
      communicationModes,
      firstStage: stages?.[0]?.name,
    },
  };
};

export const mapCategories = (categories: Category[]) => {
  return categories.map((category: Category) => {
    const id =
      category.isDefault || category.id.startsWith(category.name.toLowerCase().replace(/\s+/g, '-'))
        ? undefined
        : category.id;

    return { ...category, id, isDefault: false };
  });
};

export const getRemovedCategoriesIds = (prevCategories: Category[], newCategories: Category[]) => {
  return getArraysDiff(prevCategories, newCategories)
    .filter(({ isDefault }) => !isDefault)
    .map(({ id }) => id);
};
