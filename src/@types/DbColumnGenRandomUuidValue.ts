import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';
import { SpecialValueType } from './SpecialValueType.ts';

export type DbColumnGenRandomUuidValue = DbColumnSpecialValue<SpecialValueType.GEN_RANDOM_UUID>;
