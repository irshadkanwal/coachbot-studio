'server only';

import { Decimal } from '@prisma/client/runtime/library';

export function convertDecimalValues(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Decimal) {
      result[key] = value.toNumber();
    } else {
      result[key] = value;
    }
  }

  return result;
}
