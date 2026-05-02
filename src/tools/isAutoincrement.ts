import type { DbColumnAutoincrementValue } from '../@types/DbColumnAutoincrementValue.ts';
import { isSpecialValue } from './isSpecialValue.ts';

export function isAutoincrement(value: any): value is DbColumnAutoincrementValue {
  return isSpecialValue(value) && value.type === 'AUTO_INCREMENT';
}
