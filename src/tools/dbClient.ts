import pg from 'pg';
import type { TypeId } from 'pg-types';
import types from 'pg-types';
import type { DbConfig } from './@types/DbConfig.ts';

// TIMESTAMP
types.setTypeParser(types.builtins.TIMESTAMP, (val) => val == null ? null : normalizeTimestamp(val));

// TIMESTAMP[]
types.setTypeParser(1115 as TypeId, (val) => val == null ? null : normalizeTimestampArray(val));

// TIMESTAMPTZ
types.setTypeParser(types.builtins.TIMESTAMPTZ, (val) => val == null ? null : normalizeTimestampWithTimezone(val));

// TIMESTAMPTZ[]
types.setTypeParser(1185 as TypeId, (val) => val == null ? null : normalizeTimestampWithTimezoneArray(val));

// TIMETZ
types.setTypeParser(types.builtins.TIMETZ, (val) => val == null ? null : normalizeTimeWithTimezone(val));

// TIMETZ[]
types.setTypeParser(1270 as TypeId, (val) => val == null ? null : normalizeTimeWithTimezoneArray(val));

export function createDbClient(config: DbConfig) {
  let db: null | pg.Client = null;

  return {
    connect: async () => {
      if ( ! db) {
        db = new pg.Client({ types, ...config });
        await db.connect();
      }
    },
    disconnect: async () => {
      if (db) {
        const dbCopy = db;
        db = null;
        await dbCopy.end();
      }
    },
    query: async (query: string, values?: any[]) => {
      if ( ! db) {
        throw new Error(`It looks like you are trying to query the database, but it has not been connected yet or has already been closed`);
      }
      try {
        return await db.query(query, values);
      }
      catch (error) {
        // @ts-ignore
        error.query = query;
        // @ts-ignore
        error.values = values;
        throw error;
      }
    },
  };
}

function normalizeTimestamp(value: string) {
  return value.replace(` `, `T`);
}

function normalizeTimestampArray(value: string) {
  return value
    .slice(1, -1) // Убираем фигурные скобки по краям
    .split(`,`) // Разбиваем через запятую
    .map((value) => {
      return value === `NULL` ? null : normalizeTimestamp(value.slice(1, -1) /* Убираем кавычки */);
    });
}

function normalizeTimestampWithTimezone(value: string) {
  const [date, timeWithTimezone] = value.split(` `);
  if (timeWithTimezone.endsWith(`Z`)) {
    return date + `T` + timeWithTimezone;
  }
  else {
    const timezone = timeWithTimezone.split(/[+-]/)[1];
    if (timezone.length === 2) {
      return date + `T` + timeWithTimezone + `:00`;
    }
    else {
      return date + `T` + timeWithTimezone;
    }
  }
}

function normalizeTimestampWithTimezoneArray(value: string) {
  return value
    .slice(1, -1) // Убираем фигурные скобки по краям
    .split(`,`) // Разбиваем через запятую
    .map((value) => {
      return value === `NULL` ? null : normalizeTimestampWithTimezone(value.slice(1, -1) /* Убираем кавычки */);
    });
}

function normalizeTimeWithTimezone(value: string) {
  if (value.endsWith(`Z`)) {
    return value;
  }
  else {
    const timezone = value.split(/[+-]/)[1];
    if (timezone.length === 2) {
      return value + `:00`;
    }
    else {
      return value;
    }
  }
}

function normalizeTimeWithTimezoneArray(value: string) {
  return value
    .slice(1, -1) // Убираем фигурные скобки по краям
    .split(`,`) // Разбиваем через запятую
    .map((value) => {
      return value === `NULL` ? null : normalizeTimeWithTimezone(value);
    });
}
