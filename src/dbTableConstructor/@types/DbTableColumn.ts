import type { DbTableAnyColumn } from './DbTableAnyColumn.ts';
import type { DbTableArrayOfAnyColumn } from './DbTableArrayOfAnyColumn.ts';
import type { DbTableArrayOfBooleanColumn } from './DbTableArrayOfBooleanColumn.ts';
import type { DbTableArrayOfNumberColumn } from './DbTableArrayOfNumberColumn.ts';
import type { DbTableArrayOfStringColumn } from './DbTableArrayOfStringColumn.ts';
import type { DbTableBooleanColumn } from './DbTableBooleanColumn.ts';
import type { DbTableNumberColumn } from './DbTableNumberColumn.ts';
import type { DbTableStringColumn } from './DbTableStringColumn.ts';

export type DbTableColumn<
  TDbItem extends Record<string, any> = Record<string, any>,
> = { [TKey in keyof TDbItem]: TKey extends string
  ?
    | Extends<TDbItem, TKey, boolean, DbTableBooleanColumn<TKey, TDbItem>>
    | Extends<TDbItem, TKey, number, DbTableNumberColumn<TKey, TDbItem>>
    | Extends<TDbItem, TKey, bigint, DbTableNumberColumn<TKey, TDbItem>>
    | Extends<TDbItem, TKey, string, DbTableStringColumn<TKey, TDbItem>>
    | Extends<TDbItem, TKey, boolean[], DbTableArrayOfBooleanColumn<TKey, TDbItem>>
    | Extends<TDbItem, TKey, number[], DbTableArrayOfNumberColumn<TKey, TDbItem>>
    | Extends<TDbItem, TKey, bigint[], DbTableArrayOfNumberColumn<TKey, TDbItem>>
    | Extends<TDbItem, TKey, string[], DbTableArrayOfStringColumn<TKey, TDbItem>>
    | Extends<TDbItem, TKey, any[], DbTableArrayOfAnyColumn<TKey, TDbItem>>
    | DbTableAnyColumn<TKey, TDbItem>
  : never
}[keyof TDbItem];

type Extends<
  TDbItem extends Record<string, any> = Record<string, any>,
  TKey extends keyof TDbItem = keyof TDbItem,
  TType extends any = any,
  TResult extends any = any,
> = [Extract<TDbItem[TKey], TType>] extends [never]
  ? never
  : TResult;
