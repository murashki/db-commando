import { line } from 'proprompt';
import type { DbCommandoContext } from '../../../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { buildConstraintsQuery } from '../../../../tools/buildConstraintsQuery.ts';
import { buildCreateTableQuery } from '../../../../tools/buildCreateTableQuery.ts';
import { getDbTableConstraints } from '../../../../tools/getDbTableConstraints.ts';
import { getDbTableSchema } from '../../../../tools/getDbTableSchema.ts';

export async function handleDumpTableModule(context: DbCommandoContext, table: DbTable): Promise<void> {
  const columns = await getDbTableSchema(context, table.name);
  const constraints = await getDbTableConstraints(context, table.name);

  const parts = [buildCreateTableQuery(table.name, columns)];

  if (constraints.length > 0) {
    parts.push(buildConstraintsQuery(table.name, constraints));
  }

  await line(`\n` + parts.join(`\n\n`) + `\n`, { as: `clear` });
}
