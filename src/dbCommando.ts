import fs from 'node:fs';
import { message } from 'proprompt';
import { select } from 'proprompt';
import type { DbCommandoConfig } from './@types/DbCommandoConfig.ts';
import type { DbCommandoContext } from './@types/DbCommandoContext.ts';
import { EDbCommandoMenuKey } from './menu.ts';
import { DB_COMMANDO_MENU_OPTIONS } from './menu.ts';

export async function dbCommando(config: DbCommandoConfig): Promise<void> {
  const systemDir = config.systemDir || `./.db-commando`;
  const tableConfigs = config.tableConfigs || {};

  const context: DbCommandoContext = {
    ...config,
    systemDir,
    tableConfigs,
  };

  if ( ! fs.existsSync(systemDir)) {
    fs.mkdirSync(systemDir, { recursive: true });
  }

  while (true) {
    const menuSelectResult = await select({
      message: 'Select an option',
      options: DB_COMMANDO_MENU_OPTIONS,
    });

    if (menuSelectResult.canceled || menuSelectResult.value.key === EDbCommandoMenuKey.BACK) {
      return;
    }

    if (typeof menuSelectResult.value.module === 'function') {
      await menuSelectResult.value.module(context);
    }
    else {
      await message(`Unsupported option`, { as: `danger` });
    }
  }
}
