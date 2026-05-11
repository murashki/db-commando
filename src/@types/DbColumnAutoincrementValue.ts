import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';
import { SpecialValueType } from './SpecialValueType.ts';

export type DbColumnAutoincrementValue = DbColumnSpecialValue<SpecialValueType.AUTO_INCREMENT>;
