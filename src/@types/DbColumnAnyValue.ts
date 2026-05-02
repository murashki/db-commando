import type { DbColumnSpecialValue } from './DbColumnSpecialValue.ts';

export type DbColumnAnyValue = DbColumnSpecialValue<`ANY`> & {
  value: any;
};
