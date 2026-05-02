import pg from 'pg';
import { confirmAction } from 'proprompt';
import { exception } from 'proprompt';
import { message } from 'proprompt';
import { select } from 'proprompt';
import { getTableNames } from '../../tools/getTableNames.ts';
import { confirmDbQuery } from '../../tools/confirmDbQuery.ts';
import { updateExecutedDbQueryLogFile } from '../../tools/updateExecutedDbQueryLogFile.ts';
import type { AppContext } from '../../@types/AppContext.ts';

export async function handleDropDbTableModule(context: AppContext): Promise<void> {
  while (true) {
    const tableNames = await getTableNames(context);

    const tableNameSelectResult = await select({
      message: `Select a table`,
      options: tableNames.map((tableName) => {
        return { value: tableName, label: `${tableName}...` };
      }),
    });

    if (tableNameSelectResult.canceled) {
      return;
    }
    else {
      const tableName = tableNameSelectResult.value;

      const actionName = `delete "${tableName}" table`;
      const confirmed = await confirmAction(actionName, tableName);

      if (confirmed) {
        const query = await buildQuery({
          tableName,
        });

        const queryConfirmed = await confirmDbQuery(query, context);

        if (queryConfirmed) {
          try {
            await context.dbClient.query(query);
            await message(`Successfully executed`, { as: `success` });
            await updateExecutedDbQueryLogFile(context, {
              query,
              status: `success`,
            });
          } catch (error) {
            await updateExecutedDbQueryLogFile(context, {
              query,
              status: `error`,
            });
            await exception(error, { message: `There was a problem during the query execution:` });
          }

          return;
        }
        else {
          continue;
        }
      }
      else {
        continue;
      }
    }
  }
}

type BuildQueryParams = {
  tableName: string;
};

async function buildQuery(params: BuildQueryParams) {
  return `
    DROP TABLE ${pg.escapeIdentifier(params.tableName)} CASCADE;
  `;
}
