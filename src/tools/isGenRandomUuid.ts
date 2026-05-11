import type { DbColumnGenRandomUuidValue } from '../@types/DbColumnGenRandomUuidValue.ts';
import { SpecialValueType } from '../@types/SpecialValueType.ts';
import { isSpecialValue } from './isSpecialValue.ts';

export function isGenRandomUuid(value: any): value is DbColumnGenRandomUuidValue {
  return isSpecialValue(value) && value.type === SpecialValueType.GEN_RANDOM_UUID;
}
