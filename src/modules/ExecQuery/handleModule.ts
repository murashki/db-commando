import { exception } from 'proprompt';
import { message } from 'proprompt';
import { plainObjectTable } from 'proprompt';
import { text } from 'proprompt';
import type { AppContext } from '../../@types/AppContext.ts';

export async function handleExecQueryModule(context: AppContext) {
  let lastQuery = ``;

  while (true) {
    const queryTextResult = await text({
      message: `Type query`,
      initialValue: lastQuery,
    });

    if (queryTextResult.canceled) {
      return;
    }
    else {
      lastQuery = queryTextResult.value;

      try {
        const result = await context.dbClient.query(lastQuery);
        await message(`Successfully executed`, { as: `success` });
        await plainObjectTable(result.rows);
      }
      catch (error) {
        await exception(error, { message: `There was a problem during the query execution:` });
      }
    }
  }
}
