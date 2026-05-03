import pg from 'pg';
import { exception } from 'proprompt';
import { message } from 'proprompt';
import { TerminatedByEsc } from 'proprompt';
import { text } from 'proprompt';
import { confirmDbQuery } from '../../tools/confirmDbQuery.ts';
import type { DbCommandoContext } from '../../@types/DbCommandoContext.ts';
import { getTableNames } from '../../tools/getTableNames.ts';
import { updateExecutedDbQueryLogFile } from '../../tools/updateExecutedDbQueryLogFile.ts';

export async function handleCreateDbTableModule(context: DbCommandoContext) {
  try {
    while (true) {
      const tableNameTextResult = await text({
        message: `Enter table name`,
        throwOnEsc: true,
      });

      const tableNames = await getTableNames(context);

      if (tableNames.map((tableName) => tableName.toLowerCase()).includes(tableNameTextResult.value.toLowerCase())) {
        await message(`Table with the specified name already exists`, { as: `warning` });
      }
      else {
        const query = await buildQuery({
          tableName: tableNameTextResult.value,
        });

        const queryConfirmed = await confirmDbQuery(query, context);

        if (queryConfirmed) {
          try {
            await context.dbConnection.query(query);
            await message(`Successfully executed`, { as: `success` });
            await updateExecutedDbQueryLogFile(context, {
              query,
              status: `success`,
            });
          }
          catch (error) {
            await updateExecutedDbQueryLogFile(context, {
              query,
              status: `error`,
            });
            await exception(error, { message: `There was a problem during the query execution:` });
          }

          return;
        }
      }
    }
  }
  catch (error) {
    if (error instanceof TerminatedByEsc) {
      return;
    }
    else {
      throw error;
    }
  }
}

type BuildQueryParams = {
  tableName: string;
};

async function buildQuery(params: BuildQueryParams) {
  return `
    CREATE TABLE ${pg.escapeIdentifier(params.tableName)} ();
  `;
}
