import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';
import { SpecialValueType } from './SpecialValueType.ts';

export type DbColumnNowValue = DbColumnSpecialValue<SpecialValueType.NOW>;
