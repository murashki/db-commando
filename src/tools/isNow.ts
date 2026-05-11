import type { DbColumnNowValue } from '../@types/DbColumnNowValue.ts';
import { isSpecialValue } from './isSpecialValue.ts';
import { SpecialValues } from './specialValues.ts';

export function isNow(value: any): value is DbColumnNowValue {
  return isSpecialValue(value) && value.type === SpecialValues.NOW;
}
