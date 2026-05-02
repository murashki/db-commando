import pg from 'pg';
import { exception } from 'proprompt';
import { message } from 'proprompt';
import { TerminatedByEsc } from 'proprompt';
import { confirmDbQuery } from '../../../../tools/confirmDbQuery.ts';
import { enterColumnValue } from '../../../../tools/enterColumnValue.ts';
import { getDbTableSchema } from '../../../../tools/getDbTableSchema.ts';
import { querifyValue } from '../../../../tools/querifyValue.ts';
import { updateExecutedDbQueryLogFile } from '../../../../tools/updateExecutedDbQueryLogFile.ts';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import type { AppContext } from '../../../../@types/AppContext.ts';
import type { DbColumnValue } from '../../../../@types/DbColumnValue.ts';

export async function handleInsertIntoTableModule(context: AppContext, table: DbTable) {
  const dbTableSchema = await getDbTableSchema(context, table.name);

  if ( ! dbTableSchema.length) {
    await message(`Table have no columns`, { as: `warning` });
  }
  else {
    try {
      const values: QueryValue[] = [];
      for (const item of dbTableSchema) {
        if (item.columnType.editConfig?.controlType) {
          const value = await enterColumnValue({
            columnName: item.name,
            columnType: item.columnType,
            context: `value`,
            defaultValue: item.defaultValue,
            nullable: item.nullable,
            preparedLabelOut: item.preparedLabelOut,
          });
          values.push({
            columnName: item.name,
            preparedPgTypeIn: item.preparedPgTypeIn,
            value,
          });
        }
      }

      const query = await buildQuery({
        tableName: table.name,
        values,
      });

      const queryConfirmed = await confirmDbQuery(query, context);

      if (queryConfirmed) {
        try {
          await context.dbClient.query(query);
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
}

type QueryValue = {
  columnName: string;
  preparedPgTypeIn: string;
  value: DbColumnValue;
};

type BuildQueryParams = {
  tableName: string;
  values: QueryValue[];
};

async function buildQuery(params: BuildQueryParams) {
  const columnNamesPart = params.values.map((value) => {
    return pg.escapeIdentifier(value.columnName);
  }).join(`, `);

  const columnValuesPart = params.values.map((value) => {
    return querifyValue(value.value, value.preparedPgTypeIn);
  }).join(`, `);

  return `
    INSERT INTO "public".${pg.escapeIdentifier(params.tableName)}
      (${columnNamesPart})
    VALUES
      (${columnValuesPart});
  `;
}
