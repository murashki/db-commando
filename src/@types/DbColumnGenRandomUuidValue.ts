import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';
import { SpecialValues } from './specialValues.ts';

export type DbColumnGenRandomUuidValue = DbColumnSpecialValue<SpecialValues.GEN_RANDOM_UUID>;
