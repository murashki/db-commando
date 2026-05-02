import type { QueryResult } from './QueryResult.ts';
import type { QueryResultRow } from './QueryResultRow.ts';

export type DbClient = {
  query: {
    <
      TData extends QueryResultRow = QueryResultRow,
    >(query: string, values?: any[]): Promise<QueryResult<TData>>;
  };
};
