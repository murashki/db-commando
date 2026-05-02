import c from 'chalk';
import type { TableColumn } from 'proprompt';
import { message } from 'proprompt';
import { stringify } from 'proprompt';
import { table } from 'proprompt';
import { getDbTableSchema } from './getDbTableSchema.ts';
import type { AppContext } from '../@types/AppContext.ts';
import type { DbColumnSchema } from '../@types/DbColumnSchema.ts';
import { isSpecialValue } from './isSpecialValue.ts';

export async function printDbTableSchema(context: AppContext, tableName: string) {
  const dbTableSchema = await getDbTableSchema(context, tableName);

  if ( ! dbTableSchema.length) {
    await message(`No columns found`, { as: `warning`});
  }
  else {
    await table({ animate: true, columns, data: dbTableSchema });
    await message(c.dim(`${dbTableSchema.length} records are displayed`));
  }
}

const columns: TableColumn<DbColumnSchema>[] = [
  {
    title: `Column name`,
    render: (item) => {
      if (item.primaryKey) {
        return c.green(`${item.name} [PRIMARY KEY]`);
      }
      else {
        return item.name;
      }
    },
  },
  {
    title: `Type`,
    render: (item) => {
      return item.preparedLabelOut;
    },
  },
  {
    title: `Nullable`,
    render: (item) => {
      return item.nullable ? `YES` : `NO`;
    },
  },
  {
    title: `Default`,
    render: (item) => {
      return stringify(item.defaultValue, {
        depth: Infinity,
        inline: true,
        primitivesUppercase: true,
        specialValues: (value: any) => {
          if (isSpecialValue(value)) {
            return c.yellow(value.type);
          }
          else {
            return null;
          }
        },
      });
    },
  },
];
