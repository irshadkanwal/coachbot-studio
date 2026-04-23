'use server';

export async function getPresets(): Promise<any[]> {
  return [{ id: 0, title: 'Default', value: 'default' }];
}

export async function chageSelectedModel({ value }: any): Promise<any> {
  console.warn('Selected mnew model: ' + value);

  return value;
}
