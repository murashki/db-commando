import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';

export type DbColumnScalarValue = null | boolean | number | bigint | string | Date | DbColumnSpecialValue;
