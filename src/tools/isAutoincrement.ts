import type { DbColumnAutoincrementValue } from '../@types/DbColumnAutoincrementValue.ts';
import { isSpecialValue } from './isSpecialValue.ts';
import { SpecialValues } from './specialValues.ts';

export function isAutoincrement(value: any): value is DbColumnAutoincrementValue {
  return isSpecialValue(value) && value.type === SpecialValues.AUTO_INCREMENT;
}
