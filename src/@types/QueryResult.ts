import type { QueryResultRow } from './QueryResultRow.ts';

export type QueryResult<
  TQueryResultRow extends QueryResultRow = QueryResultRow,
> = {
  rows: TQueryResultRow[];
};
