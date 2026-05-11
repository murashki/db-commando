import { line } from 'proprompt';
import type { DbColumnSchema } from '../../@types/DbColumnSchema.ts';
import type { DbCommandoContext } from '../../@types/DbCommandoContext.ts';
import type { DbTableConstraint } from '../../@types/DbTableConstraint.ts';
import { buildConstraintsQuery } from '../../tools/buildConstraintsQuery.ts';
import { buildCreateTableQuery } from '../../tools/buildCreateTableQuery.ts';
import { getDbTableConstraints } from '../../tools/getDbTableConstraints.ts';
import { getDbTableSchema } from '../../tools/getDbTableSchema.ts';
import { getTableNames } from '../../tools/getTableNames.ts';

type TableData = {
  columns: DbColumnSchema[];
  constraints: DbTableConstraint[];
  tableName: string;
};

export async function handleDumpDatabaseModule(context: DbCommandoContext): Promise<void> {
  const tableNames = await getTableNames(context);

  const tableData: TableData[] = [];

  for (const tableName of tableNames) {
    const columns = await getDbTableSchema(context, tableName);
    const constraints = await getDbTableConstraints(context, tableName);
    tableData.push({ columns, constraints, tableName });
  }

  const createTableQueries = tableData.map(({ tableName, columns }) => {
    return buildCreateTableQuery(tableName, columns);
  });

  const constraintQueries = tableData
    .filter(({ constraints }) => constraints.length > 0)
    .map(({ tableName, constraints }) => buildConstraintsQuery(tableName, constraints));

  const parts = [...createTableQueries, ...constraintQueries];

  await line(`\n` + parts.join(`\n\n`) + `\n`, { as: `clear` });
}
