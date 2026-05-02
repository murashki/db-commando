import { message } from 'proprompt';
import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import { printDbTable } from '../../../../dbTableConstructor/printDbTable.ts';
import type { AppContext } from '../../../../@types/AppContext.ts';

export async function handlePredefinedViewRecordsModule(context: AppContext, table: DbTable): Promise<void> {
  if (table.config) {
    await printDbTable(context, table.config);
  }
  else {
    await message(`The table is not configured`, { as: `warning` });
  }
}
