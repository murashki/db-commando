import type { DB_TABLE } from '../DB_TABLE.ts';

export type DbTableArrayOfAnyColumn<
  TKey extends string = string,
  TDbItem extends Record<string, any> = Record<string, any>,
> = {
  columnName: TKey;
  dataType: typeof DB_TABLE.COLUMN.TYPE.ARRAY_OF_ANY;
  disabled?: boolean;
  maxWidth?: number;
  render?: {
    (value: TDbItem[TKey], item: TDbItem): string;
  };
  title?: string;
};
