import type { ColumnType } from '../../@types/ColumnType.ts';
import type { DbColumnScalarValue } from '../../@types/DbColumnScalarValue.ts';
import type { EnterColumnValueContext } from './EnterColumnValueContext';

export type EnterColumnScalarValueOpts = {
  arrayMemberIndex?: number;
  columnName?: string;
  columnType: ColumnType;
  context: EnterColumnValueContext
  defaultValue: null | DbColumnScalarValue;
  nullable: boolean;
  preparedLabelOut: string;
};
