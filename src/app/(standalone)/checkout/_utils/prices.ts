export const parseFeature = (raw: string): { feature: string; value: string | boolean } => {
  const match = raw.match(/^\s*\[([^\]]+)\]\s*\((.+)\)/);
  const [_, feature, rowValue] = match || [];
  const formatedValue = rowValue?.trim().toLowerCase() ?? '';
  const value = formatedValue === 'yes' ? true : formatedValue === 'no' ? false : rowValue.trim();

  return {
    feature: feature.trim() ?? '',
    value: value ?? false,
  };
};
