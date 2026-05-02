import { message } from 'proprompt';
import { select } from 'proprompt';
import { getTableNames } from '../../tools/getTableNames.ts';
import type { DbTable } from '../../dbTableConstructor/@types/DbTable.ts';
import type { AppContext } from '../../@types/AppContext.ts';
import { EDbTableAdminMenuKey } from './menu.ts';
import { DB_TABLE_MENU_OPTIONS } from './menu.ts';

export async function handleDbTableAdminModule(context: AppContext): Promise<void> {
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
          return { value: table, label: `${table.name}...` };
        }),
      });

      if (tableSelectResult.canceled) {
        return;
      }
      else {
        const table = tableSelectResult.value;

        while (true) {
          const menuSelectResult = await select({
            message: `Select an option`,
            options: DB_TABLE_MENU_OPTIONS,
          });

          if (menuSelectResult.canceled || menuSelectResult.value.key === EDbTableAdminMenuKey.BACK) {
            break;
          }
          else if (menuSelectResult.value.module) {
            await menuSelectResult.value.module(context, table);
          }
          else {
            await message(`Unsupported option`, { as: `danger` });
          }
        }
      }
    }
  }
}

async function getTables(context: AppContext): Promise<DbTable<any>[]> {
  const tableNames = await getTableNames(context);

  return tableNames.map((tableName) => {
    const tableConfig = context.tableConfigs?.[tableName];
    return {
      name: tableName,
      config: tableConfig,
    };
  });
}
