import { editFile } from 'proprompt';
import { message } from 'proprompt';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { getQuery } from '../../../../dbTableConstructor/getQuery.ts';
import { printDbTable } from '../../../../dbTableConstructor/printDbTable.ts';
import type { AppContext } from '../../../../@types/AppContext.ts';
import { QUERY_EDIT_FILE_NAME } from '../../../../constants.ts';

export async function handlePredefinedViewRecordsWithCustomQueryModule(context: AppContext, table: DbTable): Promise<void> {
  if (table.config) {
    const query = getQuery(table.config) + `\n`;
    const nextQuery = await editFile(`${context.systemFolder}/${QUERY_EDIT_FILE_NAME}`, {
      temporary: true,
      content: query,
    });

    if (nextQuery != null) {
      try {
        await printDbTable(context, {
          ...table.config,
          query: nextQuery,
        });
      }
      catch (error) {
        // TODO handle via exception
        await message(`There was a problem during the query execution\n${(error as Error).stack}`, { as: `warning` });
      }
    }
  }
  else {
    await message(`The table is not configured`, { as: `warning` });
  }
}
