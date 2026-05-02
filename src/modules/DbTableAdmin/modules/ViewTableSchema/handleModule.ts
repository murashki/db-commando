import type { DbCommandoContext } from '../../../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { printDbTableSchema } from '../../../../tools/printDbTableSchema.ts';

export async function handleViewTableSchemaModule(context: DbCommandoContext, table: DbTable): Promise<void> {
  await printDbTableSchema(context, table.name);
}
