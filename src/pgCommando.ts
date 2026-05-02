import { message } from 'proprompt';
import { select } from 'proprompt';
import type { DbCommandoContext } from './@types/DbCommandoContext.ts';
import { EPgCommandoMenuKey } from './menu.ts';
import { PG_COMMANDO_MENU_OPTIONS } from './menu.ts';

export async function pgCommando(context: DbCommandoContext): Promise<void> {
  while (true) {
    const menuSelectResult = await select({
      message: 'Select an option',
      options: PG_COMMANDO_MENU_OPTIONS,
    });

    if (menuSelectResult.canceled || menuSelectResult.value.key === EPgCommandoMenuKey.BACK) {
      return;
    }
    else if (typeof menuSelectResult.value.module === 'function') {
      await menuSelectResult.value.module(context);
    }
    else {
      await message(`Unsupported option`, { as: `danger` });
    }
  }
}
