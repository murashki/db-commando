import type { ColumnType } from '../../@types/ColumnType.ts';
import type { DbColumnValue } from '../../@types/DbColumnValue.ts';

export type EnterColumnValueOpts = {
  arrayMemberIndex?: number;
  columnName?: string;
  columnType: ColumnType;
  context: `default-value` | `value`;
  defaultValue: DbColumnValue;
  nullable: boolean;
  preparedLabelOut: string;
};
