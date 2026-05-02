import pg from 'pg';
import type { DbColumnValue } from '../@types/DbColumnValue.ts';
import { isGenRandomUuid } from './isGenRandomUuid.ts';
import { isNow } from './isNow.ts';

export function querifyValue(value: DbColumnValue, preparedPgTypeIn?: string): string {
  let queryValue = ``;

  if (value == null) {
    queryValue = `NULL`;
  }
  else if (typeof value === `boolean`) {
    queryValue = String(value).toUpperCase();
  }
  else if (typeof value === `number`) {
    queryValue = String(value);
  }
  else if (typeof value === `bigint`) {
    queryValue = String(value);
  }
  else if (typeof value === `string`) {
    queryValue = pg.escapeLiteral(value);
  }
  else if (Array.isArray(value)) {
    queryValue = (value as DbColumnValue[])
      .map((defaultValue) => {
        return querifyValue(defaultValue);
      })
      .join(`, `);
    queryValue = `ARRAY[${queryValue}]`;
  }
  else if (isNow(value)) {
    queryValue = `NOW()`;
  }
  else if (isGenRandomUuid(value)) {
    queryValue = `GEN_RANDOM_UUID()`;
  }
  else {
    queryValue = String(value);
  }

  if (preparedPgTypeIn && value != null) {
    queryValue = `${queryValue}::${preparedPgTypeIn}`;
  }

  return queryValue;
}
