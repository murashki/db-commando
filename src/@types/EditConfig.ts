import type { DbColumnScalarValue } from './DbColumnScalarValue.ts';
import type { EditControlType } from './EditControlType.ts';

export type EditConfig = {
  /*
    Sometimes a column has a value or default, but it cannot be entered or edited — for example
    autoincrement columns. For such columns this field should be absent.
   */
  controlType?: EditControlType;

  defaultValue: null | DbColumnScalarValue;
};
