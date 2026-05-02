import type { DbColumnSpecialValue } from '../@types/DbColumnSpecialValue.ts';

export function isSpecialValue(value: any): value is DbColumnSpecialValue {
  return value && typeof value === `object` && 'type' in value;
}
