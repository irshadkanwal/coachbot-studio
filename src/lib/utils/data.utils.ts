export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => deepEqual(obj1[key], obj2[key]));
};

export const mapFiles = (files: File[], status: string, message?: string) => {
  return files.map((file: File, index: number) => ({
    content: file,
    id: `${Date.now()}-${file.name}-${index}`,
    name: file.name,
    status,
    message,
  }));
};

export const toBoolean = (value: string | boolean | undefined | null): boolean => {
  if (typeof value === 'boolean') return value;

  return value ? value?.toLowerCase() === 'true' : false;
};
