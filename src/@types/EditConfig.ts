import type { DbColumnValue } from './DbColumnValue.ts';
import type { EditControlType } from './EditControlType.ts';

export type EditConfig = {
  /*
    Sometimes a column has a value or default but it cannot be entered or edited — for example UUID
    or autoincrement columns. For such columns this field should be absent.
   */
  controlType?: EditControlType;

  defaultValue: DbColumnValue;
};
