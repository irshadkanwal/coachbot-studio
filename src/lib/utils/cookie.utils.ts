import { cookies } from 'next/headers';

import { decrypt } from './encryption.utils';

export const getCookie = async <T>(name: string, encrypted?: boolean, secretKey?: string): Promise<T> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(name)?.value;

  return (value && encrypted ? decrypt<T>(value, secretKey) : value) as T;
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
