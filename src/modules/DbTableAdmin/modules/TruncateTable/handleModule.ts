import pg from 'pg';
import { TerminatedByEsc } from 'proprompt';
import { exception } from 'proprompt';
import { message } from 'proprompt';
import type { DbCommandoContext } from '../../../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { confirmDbQuery } from '../../../../tools/confirmDbQuery.ts';
import { updateExecutedDbQueryLogFile } from '../../../../tools/updateExecutedDbQueryLogFile.ts';

export async function handleTruncateTableModule(context: DbCommandoContext, table: DbTable) {
  try {
    const query = await buildQuery({
      tableName: table.name,
    });

    const queryConfirmed = await confirmDbQuery(query, context);

    if (queryConfirmed) {
      try {
        await context.dbConnection.query(query);
      } catch (error) {
        await updateExecutedDbQueryLogFile(context, {
          query,
          status: `error`,
        });
        await exception(error, { message: `There was a problem during the query execution:` });
        return;
      }

      await message(`Successfully executed`, { as: `success` });
      await updateExecutedDbQueryLogFile(context, {
        query,
        status: `success`,
      });
      return;
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
    TRUNCATE TABLE "public".${pg.escapeIdentifier(params.tableName)};
  `;
}
