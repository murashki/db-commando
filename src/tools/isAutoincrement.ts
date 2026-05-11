import type { DbColumnAutoincrementValue } from '../@types/DbColumnAutoincrementValue.ts';
import { SpecialValueType } from '../@types/SpecialValueType.ts';
import { isSpecialValue } from './isSpecialValue.ts';

export function isAutoincrement(value: any): value is DbColumnAutoincrementValue {
  return isSpecialValue(value) && value.type === SpecialValueType.AUTO_INCREMENT;
}
