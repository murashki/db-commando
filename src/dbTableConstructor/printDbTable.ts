import c from 'chalk';
import type { StringifyOpts } from 'proprompt';
import { line } from 'proprompt';
import { message } from 'proprompt';
import { table } from 'proprompt';
import { stringify } from 'proprompt';
import type { DbCommandoContext } from '../@types/DbCommandoContext.ts';
import { printDbQuery } from '../tools/printDbQuery.ts';
import type { DbTableConfig } from './@types/DbTableConfig.ts';
import { DB_TABLE } from './DB_TABLE.ts';
import { getQuery } from './getQuery.ts';
import { isDbTableStringReplaceMapRender } from './isDbTableStringReplaceMapRender.ts';
import { isDbTableStringReplaceRender } from './isDbTableStringReplaceRender.ts';

export async function printDbTable<
  TDbItem extends Record<string, any> = Record<string, any>,
>(context: DbCommandoContext, config: DbTableConfig<TDbItem>) {
  const query = getQuery(config);

  await line(c.dim(`DB query:`));
  await line(``, { as: `clear` });
  await printDbQuery(query);
  await line(``, { as: `clear` });

  const rows = (await context.dbConnection.query<TDbItem>(query)).rows;

  if ( ! rows.length) {
    await message(`No records found`, { as: `warning` });
  }
  else {
    const columns = config.columns
      .filter((column) => {
        return ! column.disabled;
      })
      .map((column) => {
        const { columnName, dataType, title, render: columnRender, ...rest } = column;

        const baseColumnConfig = {
          ...rest,
          title: title || columnName,
        };

        const stringifyOpts: StringifyOpts = {
          depth: Infinity,
          inline: true,
          primitivesUppercase: true,
        };

        let render: (item: TDbItem) => string;
        if (columnRender) {
          render = (item: TDbItem) => {
            return (columnRender as (value: any, item: TDbItem) => string)(item[columnName], item);
          };
        }
        else {
          render = (item: TDbItem) => {
            return stringify(item[columnName], stringifyOpts);
          };
        }

        if (dataType === DB_TABLE.COLUMN.TYPE.STRING || dataType === DB_TABLE.COLUMN.TYPE.ARRAY_OF_STRING) {
          if (isDbTableStringReplaceMapRender(columnRender)) {
            render = (item) => {
              return stringify(item[columnName], {
                ...stringifyOpts,
                specialValues: (value) => {
                  if (typeof value === `string`) {
                    let nextValue = String(value);
                    if (nextValue in columnRender.replaceMap) {
                      nextValue = String(columnRender.replaceMap[nextValue]);
                    }
                    return stringify(nextValue, stringifyOpts);
                  }
                  else {
                    return null;
                  }
                },
              });
            };
          }
          else if (isDbTableStringReplaceRender(columnRender)) {
            render = (item) => {
              return stringify(item[columnName], {
                ...stringifyOpts,
                specialValues: (value) => {
                  if (typeof value === `string`) {
                    let nextValue = String(value);
                    nextValue = nextValue.replace(columnRender.pattern, columnRender.replacement);
                    return stringify(nextValue, stringifyOpts);
                  }
                  return null;
                },
              });
            };
          }
          else {
            render = (item) => {
              return stringify(item[columnName], {
                ...stringifyOpts,
                specialValues: (value) => {
                  if (typeof value === `string`) {
                    const nextValue = String(value);
                    return stringify(nextValue, stringifyOpts);
                  }
                  return null;
                },
              });
            };
          }
        }

        return {
          ...baseColumnConfig,
          render,
        };
      });

    await table({ animate: true, columns, data: rows });

    await message(c.dim(`${rows.length} records are displayed`));
  }
}
