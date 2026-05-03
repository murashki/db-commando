import fs from 'node:fs';
import { message } from 'proprompt';
import { select } from 'proprompt';
import type { DbCommandoConfig } from './@types/DbCommandoConfig.ts';
import type { DbCommandoContext } from './@types/DbCommandoContext.ts';
import { EDbCommandoMenuKey } from './menu.ts';
import { DB_COMMANDO_MENU_OPTIONS } from './menu.ts';

export async function dbCommando(config: DbCommandoConfig): Promise<void> {
  const systemFolder = context.systemFolder || `./.db-commando`;
  const tableConfigs = context.tableConfigs || {};

  const context: DbCommandoContext = {
    ...config,
    systemFolder,
    tableConfigs,
  };

  if ( ! fs.existsSync(systemFolder)) {
    fs.mkdirSync(systemFolder, { recursive: true });
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
