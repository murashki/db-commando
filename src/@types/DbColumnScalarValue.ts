import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';

export type DbColumnScalarValue = boolean | number | bigint | string | Date | DbColumnSpecialValue;
