import type { DbColumnGenRandomUuidValue } from '../@types/DbColumnGenRandomUuidValue.ts';
import { isSpecialValue } from './isSpecialValue.ts';
import { SpecialValues } from './specialValues.ts';

export function isGenRandomUuid(value: any): value is DbColumnGenRandomUuidValue {
  return isSpecialValue(value) && value.type === SpecialValues.GEN_RANDOM_UUID;
}
