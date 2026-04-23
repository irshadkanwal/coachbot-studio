export const handleInputMinMaxRange = (e: React.ChangeEvent<HTMLInputElement>, min: number, max: number) => {
  const value = e.target.value.replace(/[^0-9]/g, '');
  let num = Number(value);

  if (value === '') {
    return '';
  }
  if (num < min) num = min;
  if (num > max) num = max;

  e.target.value = `${num}`;
};

export const handleBlockedKeys = (
  e: React.KeyboardEvent<HTMLInputElement>,
  blockedSigns: string[] = ['e', 'E', '+', '-', '.']
) => {
  if (blockedSigns.includes(e.key)) {
    e.preventDefault();
  }
};

export const validateNotEmpty = (value: string) => {
  return value.trim() !== '' || 'General.errors.emptyFiled';
};
