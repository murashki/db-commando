import type { DbColumnSchema } from '../@types/DbColumnSchema.ts';
import { querifyValue } from './querifyValue.ts';

export function buildCreateTableQuery(tableName: string, columns: DbColumnSchema[]): string {
  const columnDefs = columns.map((column) => {
    const parts = [`  "${column.name}" ${column.preparedPgTypeIn}`];

    if (!column.nullable) {
      parts.push(`NOT NULL`);
    }

    const defaultSql = querifyValue(column.defaultValue, column.preparedPgTypeIn);
    if (defaultSql !== null) {
      parts.push(`DEFAULT ${defaultSql}`);
    }

    return parts.join(` `);
  });

  const primaryKeyColumns = columns.filter((column) => column.primaryKey);
  if (primaryKeyColumns.length > 0) {
    const pkList = primaryKeyColumns.map((column) => `"${column.name}"`).join(`, `);
    columnDefs.push(`  PRIMARY KEY (${pkList})`);
  }

  return `CREATE TABLE "public"."${tableName}" (\n${columnDefs.join(`,\n`)}\n);`;
}
