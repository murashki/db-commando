import fs from 'node:fs';
import type { DbCommandoContext } from '../@types/DbCommandoContext.ts';
import { QUERY_EXECUTION_HISTORY_FILE_NAME } from '../constants.ts';
import type { QueryExecutionEvent } from './@types/QueryExecutionEvent.ts';

export async function updateExecutedDbQueryLogFile(context: DbCommandoContext, queryExecutionEvent: Omit<QueryExecutionEvent, `datetime`>) {
  const filePath = `${context.dbCommandoConfig.systemDir}/${QUERY_EXECUTION_HISTORY_FILE_NAME}`;
  let queryHistory: QueryExecutionEvent[] = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, { encoding: `utf8` });
    queryHistory = content ? JSON.parse(content) : [];
  }

  const datetime = (new Date()).toISOString();

  const nextQueryHistory = [
    ...queryHistory.slice(-99),
    { ...queryExecutionEvent, datetime },
  ];

  fs.writeFileSync(filePath, JSON.stringify(nextQueryHistory, null, 2), { flag: `w`, encoding: `utf8` });
}
