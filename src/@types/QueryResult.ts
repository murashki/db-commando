import type { QueryResultRow } from './QueryResultRow.ts';

export type QueryResult<
  TQueryResult extends QueryResultRow = QueryResultRow,
> = {
  rows: TQueryResult[];
};
