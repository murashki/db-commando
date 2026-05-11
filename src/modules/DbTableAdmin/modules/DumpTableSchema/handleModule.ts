import { message } from 'proprompt';
import type { DbColumnSchema } from '../../../../@types/DbColumnSchema.ts';
import type { DbColumnValue } from '../../../../@types/DbColumnValue.ts';
import type { DbCommandoContext } from '../../../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { getDbTableSchema } from '../../../../tools/getDbTableSchema.ts';
import { isSpecialValue } from '../../../../tools/isSpecialValue.ts';
import { isAutoincrement } from '../../../../tools/isAutoincrement.ts';
import { querifyValue } from '../../../../tools/querifyValue.ts';

export async function handleDumpTableSchemaModule(context: DbCommandoContext, table: DbTable): Promise<void> {
  const columns = await getDbTableSchema(context, table.name);
  const query = buildQuery(table.name, columns);
  await message(query, { as: `clear` });
}

function buildQuery(tableName: string, columns: DbColumnSchema[]): string {
  const columnDefs = columns.map((column) => buildColumnDef(column));

  const primaryKeyColumns = columns.filter((column) => column.primaryKey);
  if (primaryKeyColumns.length > 0) {
    const pkList = primaryKeyColumns.map((column) => `"${column.name}"`).join(`, `);
    columnDefs.push(`  PRIMARY KEY (${pkList})`);
  }

  return `CREATE TABLE "public"."${tableName}" (\n${columnDefs.join(`,\n`)}\n);`;
}

function buildColumnDef(column: DbColumnSchema): string {
  const parts = [`  "${column.name}" ${column.preparedPgTypeIn}`];

  if ( ! column.nullable) {
    parts.push(`NOT NULL`);
  }

  const defaultSql = querifyValue(column.defaultValue, column.preparedPgTypeIn);
  if (defaultSql !== null) {
    parts.push(`DEFAULT ${defaultSql}`);
  }

  return parts.join(` `);
}
