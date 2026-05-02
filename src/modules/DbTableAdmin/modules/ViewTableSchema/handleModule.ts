import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { printDbTableSchema } from '../../../../tools/printDbTableSchema.ts';
import type { AppContext } from '../../../../@types/AppContext.ts';

export async function handleViewTableSchemaModule(context: AppContext, table: DbTable): Promise<void> {
  await printDbTableSchema(context, table.name);
}
