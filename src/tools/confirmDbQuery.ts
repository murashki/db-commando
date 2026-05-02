import { editFile } from 'proprompt';
import { line } from 'proprompt';
import { select } from 'proprompt';
import type { AppContext } from '../@types/AppContext.ts';
import { QUERY_EDIT_FILE_NAME } from '../constants.ts';
import { printDbQuery } from './printDbQuery.ts';

// TODO Allow confirmation by typing specific words

/**
 * Returns:
 *   void - if the user dismissed with Esc or chose not to confirm the query;
 *   string - if the user confirmed;
 *
 * Throws:
 *   TerminatedByCtrlC - if the user dismissed with Ctrl+C;
 */
export async function confirmDbQuery(query: string, context: AppContext): Promise<void | string> {
  await line(`The following query will be executed:`, { as: `warning` });
  await line(``, { as: `clear` });
  await printDbQuery(query);
  await line(``, { as: `clear` });

  const confirmationSelectResult = await select({
    message: `Are you sure you want to execute the query?`,
    options: [
      { label: `Yes, proceed`, value: true },
      { label: `No, cancel`, value: false },
      { label: `Edit and execute`, value: null },
    ],
  });

  if (confirmationSelectResult.canceled) {
    return;
  }
  else if (confirmationSelectResult.value == null) {
    return await editFile(`${context.systemFolder}/${QUERY_EDIT_FILE_NAME}`, {
      temporary: true,
      content: query,
    });
  }
  else {
    return confirmationSelectResult.value ? query : undefined;
  }
}
