import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';
import { SpecialValues } from './specialValues.ts';

export type DbColumnNowValue = DbColumnSpecialValue<SpecialValues.NOW>;
