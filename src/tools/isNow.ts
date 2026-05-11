import type { DbColumnNowValue } from '../@types/DbColumnNowValue.ts';
import { SpecialValueType } from '../@types/SpecialValueType.ts';
import { isSpecialValue } from './isSpecialValue.ts';

export function isNow(value: any): value is DbColumnNowValue {
  return isSpecialValue(value) && value.type === SpecialValueType.NOW;
}
