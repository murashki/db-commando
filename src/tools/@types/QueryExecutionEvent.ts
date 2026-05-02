export type QueryExecutionEvent = {
  query: string;
  datetime: string;
  recordsFound?: number;
  rowsAffected?: number;
  status: `error` | `success`;
};
