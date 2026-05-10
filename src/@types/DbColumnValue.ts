import type { DbColumnScalarValue } from './DbColumnScalarValue.ts';

export type DbColumnValue = null | DbColumnScalarValue | (null | DbColumnScalarValue)[];
