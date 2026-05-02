import type { DB_TABLE } from '../DB_TABLE.ts';
import type { DbTableStringReplaceMapRender } from './DbTableStringReplaceMapRender.ts';
import type { DbTableStringReplaceRender } from './DbTableStringReplaceRender.ts';

export type DbTableArrayOfStringColumn<
  TKey extends string = string,
  TDbItem extends Record<string, any> = Record<string, any>,
> = {
  columnName: TKey;
  dataType: typeof DB_TABLE.COLUMN.TYPE.ARRAY_OF_STRING;
  disabled?: boolean;
  maxWidth?: number;
  render?:
    | {
      (value: TDbItem[TKey], item: TDbItem): string;
    }
    | DbTableStringReplaceMapRender
    | DbTableStringReplaceRender;
  title?: string;
};
