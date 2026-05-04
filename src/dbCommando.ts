import fs from 'node:fs';
import { message } from 'proprompt';
import { select } from 'proprompt';
import type { DbCommandoConfig } from './@types/DbCommandoConfig.ts';
import type { DbCommandoContext } from './@types/DbCommandoContext.ts';
import { createDbClient } from './tools/dbClient.ts';
import { EDbCommandoMenuKey } from './menu.ts';
import { DB_COMMANDO_MENU_OPTIONS } from './menu.ts';

export async function dbCommando(config: DbCommandoConfig): Promise<void> {
  const dbClient = createDbClient(config.dbConfig);
  const environment = config.environment;
  const systemDir = config.systemDir || `./.db-commando`;
  const tableConfigs = config.tableConfigs || {};

  dbClient.connect();

  const context: DbCommandoContext = {
    dbConnection: dbClient,
    environment,
    systemDir,
    tableConfigs,
  };

  if ( ! fs.existsSync(systemDir)) {
    fs.mkdirSync(systemDir, { recursive: true });
  }

  try {
    while (true) {
      const { canceled, value: menuItem } = await select({
        message: 'Select an option',
        options: DB_COMMANDO_MENU_OPTIONS,
      });

      if (canceled || menuItem.key === EDbCommandoMenuKey.BACK) {
        dbClient.disconnect();
        return;
      }

      if (typeof menuItem.module === 'function') {
        await menuItem.module(context);
      }
      else {
        await message(`Unsupported option`, { as: `danger` });
      }
    }
  }
  catch (error) {
    dbClient.disconnect();
    throw error;
  }
}
