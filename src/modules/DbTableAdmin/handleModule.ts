import c from 'chalk';
import { message } from 'proprompt';
import { select } from 'proprompt';
import type { DbCommandoContext } from '../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../dbTableConstructor/@types/DbTable.ts';
import { getTableNames } from '../../tools/getTableNames.ts';
import { EDbTableAdminMenuKey } from './menu.ts';
import { DB_TABLE_ADMIN_MENU_OPTIONS } from './menu.ts';

export async function handleDbTableAdminModule(context: DbCommandoContext): Promise<void> {
  while (true) {
    const tables = await getTables(context);

    if (tables.length === 0) {
      await message(`No tables found`, { as: `warning`});
      return;
    }
    else {
      const tableSelectResult = await select({
        message: `Select a table`,
        options: tables.map((table) => {
          return { value: table, label: `${c.italic(table.name)}...` };
        }),
      });

      if (tableSelectResult.canceled) {
        return;
      }
      else {
        const table = tableSelectResult.value;

        while (true) {
          const { canceled, value: menuItem } = await select({
            message: `Select an option`,
            options: DB_TABLE_ADMIN_MENU_OPTIONS,
          });

          if (canceled || menuItem.key === EDbTableAdminMenuKey.BACK) {
            break;
          }

          if (menuItem.module) {
            await menuItem.module(context, table);
          }
          else {
            await message(`Unsupported option`, { as: `danger` });
          }
        }
      }
    }
  }
}

async function getTables(context: DbCommandoContext): Promise<DbTable<any>[]> {
  const tableNames = await getTableNames(context);

  return tableNames.map((tableName) => {
    const tableConfig = context.tableConfigs[tableName];
    return {
      name: tableName,
      config: tableConfig,
    };
  });
}
