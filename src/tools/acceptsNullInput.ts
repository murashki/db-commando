import type { DbColumnValue } from '../@types/DbColumnValue.ts';
import type { EnterColumnValueContext } from './@types/EnterColumnValueContext.ts';

export function acceptsNullInput(context: EnterColumnValueContext, nullable: boolean, defaultValue: DbColumnValue): boolean {
  return context === `default-value`
    ? nullable && defaultValue == null
    : defaultValue == null;
}
