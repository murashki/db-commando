import pg from 'pg';
import { exception } from 'proprompt';
import { message } from 'proprompt';
import { select } from 'proprompt';
import { TerminatedByEsc } from 'proprompt';
import { text } from 'proprompt';
import type { DbCommandoContext } from '../../../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { confirmDbQuery } from '../../../../tools/confirmDbQuery.ts';
import { getDbTableSchema } from '../../../../tools/getDbTableSchema.ts';
import { printDbTableSchema } from '../../../../tools/printDbTableSchema.ts';
import { updateExecutedDbQueryLogFile } from '../../../../tools/updateExecutedDbQueryLogFile.ts';

export async function handleRenameColumnModule(context: DbCommandoContext, table: DbTable): Promise<void> {
  const dbTableSchema = await getDbTableSchema(context, table.name);

  if (dbTableSchema.length === 0) {
    await message(`No columns found`, { as: `warning` });
    return;
  }
  else {
    try {
      const { canceled, value: columnName } = await select({
        message: `Select a column`,
        options: dbTableSchema.map((tableSchemaItem) => {
          return {
            label: tableSchemaItem.name,
            value: tableSchemaItem.name,
          };
        }),
      });

      if (canceled) {
        return;
      }
      else {
        const { canceled, value: newColumnName } = await text({
          message: `Enter new column name`,
          throwOnEsc: true,
        });

        if (canceled) {
          return;
        }
        else {
          const query = await buildQuery({
            columnName,
            newColumnName,
            tableName: table.name,
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
              await printDbTableSchema(context, table.name);
            }
            catch (error) {
              await updateExecutedDbQueryLogFile(context, {
                query,
                status: `error`,
              });
              await exception(error, { message: `There was a problem during the query execution:` });
            }
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
}

type BuildQueryParams = {
  columnName: string;
  newColumnName: string
  tableName: string;
};

async function buildQuery(params: BuildQueryParams) {
  return `
    ALTER TABLE "public".${pg.escapeIdentifier(params.tableName)}
    RENAME COLUMN ${pg.escapeIdentifier(params.columnName)} TO ${pg.escapeIdentifier(params.newColumnName)};
  `;
}
