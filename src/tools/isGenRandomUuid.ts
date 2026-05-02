import type { DbColumnGenRandomUuidValue } from '../@types/DbColumnGenRandomUuidValue.ts';
import { isSpecialValue } from './isSpecialValue.ts';

export function isGenRandomUuid(value: any): value is DbColumnGenRandomUuidValue {
  return isSpecialValue(value) && value.type === 'GEN_RANDOM_UUID';
}
