import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';
import { SpecialValues } from './specialValues.ts';

export type DbColumnAutoincrementValue = DbColumnSpecialValue<SpecialValues.AUTO_INCREMENT>;
