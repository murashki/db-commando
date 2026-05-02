import type { DbTableColumn } from './DbTableColumn.ts';

export type DbTableConfig<
  TDbItem extends Record<string, any> = Record<string, any>,
> = {
  __dangerousOrderByTerm?: string;
  __dangerousWhereTerm?: string;
  columns: DbTableColumn<TDbItem>[];
  limit?: number;
  name: string;
  query?: string;
}
