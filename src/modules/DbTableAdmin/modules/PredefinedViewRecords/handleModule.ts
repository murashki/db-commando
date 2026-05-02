import { message } from 'proprompt';
import type { DbCommandoContext } from '../../../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { printDbTable } from '../../../../dbTableConstructor/printDbTable.ts';

export async function handlePredefinedViewRecordsModule(context: DbCommandoContext, table: DbTable): Promise<void> {
  if (table.config) {
    await printDbTable(context, table.config);
  }
  else {
    await message(`The table is not configured`, { as: `warning` });
  }
}
