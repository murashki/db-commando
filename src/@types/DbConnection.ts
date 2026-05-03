import type { QueryResult } from './QueryResult.ts';
import type { QueryResultRow } from './QueryResultRow.ts';

export type DbConnection = {
  query: {
    <
      TQueryResultRow extends QueryResultRow = QueryResultRow,
    >(query: string, values?: any[]): Promise<QueryResult<TQueryResultRow>>;
  };
};
