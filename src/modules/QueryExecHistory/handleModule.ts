import fs from 'node:fs';
import c from 'chalk';
import { format } from 'date-fns/format';
import { line } from 'proprompt';
import { message } from 'proprompt';
import type { QueryExecutionEvent } from '../../tools/@types/QueryExecutionEvent.ts';
import { printDbQuery } from '../../tools/printDbQuery.ts';
import type { AppContext } from '../../@types/AppContext.ts';
import { QUERY_EXECUTION_HISTORY_FILE_NAME } from '../../constants.ts';

export async function handleQueryExecHistoryModule(context: AppContext): Promise<void> {
  const filePath = `${context.systemFolder}/${QUERY_EXECUTION_HISTORY_FILE_NAME}`;
  let queryHistory: QueryExecutionEvent[] = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, { encoding: `utf8` });
    queryHistory = content ? JSON.parse(content) : [];
  }

  if (queryHistory.length) {
    await line(``, { as: `clear` });

    for (const event of queryHistory) {
      const datetime = c.dim(format(event.datetime, `yyyy.MM.dd HH:mm:ss XXX`));
      const status = event.status.replace(`success`, c.green(`Success`)).replace(`error`, c.red(`Error`));
      await line(`${c.dim(`-- Status:`)} ${status}`, { as: `clear` });
      await line(`${c.dim(`-- Timestamp:`)} ${datetime}`, { as: `clear` });
      event.recordsFound != null && await line(c.dim.gray(`-- Records found: ${event.recordsFound }`), { as: `clear` });
      event.rowsAffected != null && await line(c.dim.gray(`-- Rows affected: ${event.rowsAffected }`), { as: `clear` });
      await printDbQuery(event.query);
      await line(``, { as: `clear` });
    }
  }
  else {
    await message(`No queries found`);
  }
}
