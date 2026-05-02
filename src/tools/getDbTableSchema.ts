import pg from 'pg';
import type { AppContext } from '../@types/AppContext.ts';
import type { ColumnType } from '../@types/ColumnType.ts';
import type { DbColumnSchema } from '../@types/DbColumnSchema.ts';
import type { DbColumnValue } from '../@types/DbColumnValue.ts';
import type { DbClient } from '../@types/DbClient.ts';
import { EPgKeywords } from '../@types/EPgKeywords.ts';
// @ts-ignore
import { parse } from './defaultValueParser/parser.js';
import { arrayColumnType } from './arrayColumnType.ts';
import { columnTypes } from './columnTypes.ts';

const intTypeOuts = [
  EPgKeywords.INT_PG_TYPE_OUT,
  EPgKeywords.BIGINT_PG_TYPE_OUT,
  EPgKeywords.BIGSERIAL_PG_TYPE_OUT,
  EPgKeywords.SERIAL_PG_TYPE_OUT,
  EPgKeywords.SMALLINT_PG_TYPE_OUT,
  EPgKeywords.SMALLSERIAL_PG_TYPE_OUT,
  EPgKeywords.REAL_PG_TYPE_OUT,
].flatMap((type) => type.split(`|`));

const numericTypeOuts = [
  EPgKeywords.NUMERIC_PG_TYPE_OUT,
].flatMap((type) => type.split(`|`));

const timePgTypeOuts = [
  EPgKeywords.TIME_WITH_TIME_ZONE_PG_TYPE_OUT,
  EPgKeywords.TIME_WITHOUT_TIME_ZONE_PG_TYPE_OUT,
  EPgKeywords.TIMESTAMP_WITH_TIME_ZONE_PG_TYPE_OUT,
  EPgKeywords.TIMESTAMP_WITHOUT_TIME_ZONE_PG_TYPE_OUT,
].flatMap((type) => type.split(`|`));

const textPgTypeOuts = [
  EPgKeywords.CHAR_PG_TYPE_OUT,
  EPgKeywords.TEXT_PG_TYPE_OUT,
  EPgKeywords.VARCHAR_PG_TYPE_OUT,
].flatMap((type) => type.split(`|`));

export async function getDbTableSchema(context: AppContext, tableName: string): Promise<DbColumnSchema[]> {
  const query = `
    SELECT
      "columns"."column_name" AS "name",
      "columns"."data_type" = 'ARRAY' AS "isArray",
      "columns"."is_nullable" = 'YES' AS "nullable",
      "columns"."column_default" AS "defaultValue",
      "kcu"."column_name" IS NOT NULL AS "primaryKey",

      -- Type
      CASE
        WHEN TRUE
          AND "columns"."data_type" = 'ARRAY'
        THEN SUBSTRING("columns"."udt_name" FROM 2)
          ELSE "columns"."udt_name"
      END AS "type",

      -- Length (for strings and string arrays)
      CASE
        -- String arrays
        WHEN TRUE
          AND "columns"."data_type" = 'ARRAY'
          AND SUBSTRING("columns"."udt_name" FROM 2) IN ('${textPgTypeOuts.join(`', '`)}')
        THEN ("pg_attribute"."atttypmod" - 4) & 0xFFFF
        -- Strings
        WHEN TRUE
          AND "columns"."data_type" IN ('${textPgTypeOuts.join(`', '`)}')
        THEN "columns"."character_maximum_length"
        -- Other
        ELSE NULL
      END AS "length",

      -- Precision (for integers, floats, timestamps, and their array variants)
      CASE
        -- Integer arrays
        WHEN TRUE
          AND "columns"."data_type" = 'ARRAY'
          AND SUBSTRING("columns"."udt_name" FROM 2) IN ('${intTypeOuts.join(`', '`)}')
        THEN NULL
        -- Numeric arrays
        WHEN TRUE
         AND "columns"."data_type" = 'ARRAY'
         AND SUBSTRING("columns"."udt_name" FROM 2) IN ('${numericTypeOuts.join(`', '`)}')
        THEN (
          CASE
            WHEN TRUE
              AND "pg_attribute"."atttypmod" = -1
            THEN NULL
            ELSE (("pg_attribute"."atttypmod" - 4) >> 16) & 0xFFFF
          END
        )
        -- Timestamp arrays
        WHEN TRUE
          AND "columns"."data_type" = 'ARRAY'
          AND SUBSTRING("columns"."udt_name" FROM 2) IN ('${timePgTypeOuts.join(`', '`)}')
        THEN (REGEXP_MATCH(FORMAT_TYPE("pg_attribute"."atttypid", "pg_attribute"."atttypmod"), '\\((\\d+)\\)'))[1]::int
        -- Integers
        WHEN TRUE
          AND "columns"."data_type" IN ('${intTypeOuts.join(`', '`)}')
		    THEN NULL
        -- Floats
        WHEN TRUE
          AND "columns"."data_type" IN ('${numericTypeOuts.join(`', '`)}')
		    THEN "columns"."numeric_precision"
        -- Timestamps
        WHEN TRUE
          AND "columns"."data_type" IN ('${timePgTypeOuts.join(`', '`)}')
		    --THEN "columns"."datetime_precision"
		    THEN (REGEXP_MATCH(FORMAT_TYPE("pg_attribute"."atttypid", "pg_attribute"."atttypmod"), '\\((\\d+)\\)'))[1]::int
		    -- Other
		    ELSE NULL
      END AS "precision",

      -- Scale (for floats and float arrays)
      CASE
        -- Numeric arrays
        WHEN TRUE
          AND "columns"."data_type" = 'ARRAY'
          AND SUBSTRING("columns"."udt_name" FROM 2) IN ('${numericTypeOuts.join(`', '`)}')
        THEN (
          CASE
            WHEN TRUE
              AND "pg_attribute"."atttypmod" = -1
            THEN NULL
            ELSE ("pg_attribute"."atttypmod" - 4) & 0xFFFF
          END
        )
        -- Floats
        WHEN TRUE
          AND "columns"."data_type" IN ('${numericTypeOuts.join(`', '`)}')
		    THEN "columns"."numeric_scale"
		    -- Other
		    ELSE NULL
      END AS "scale"

    FROM "information_schema"."columns" AS "columns"
    LEFT JOIN "information_schema"."key_column_usage" AS "kcu" ON TRUE
      AND "columns"."table_name" = "kcu"."table_name"
      AND "columns"."column_name" = "kcu"."column_name"
      AND "kcu"."constraint_name" IN (
        SELECT
          "constraint_name"
        FROM "information_schema"."table_constraints"
        WHERE TRUE
          AND "constraint_type" = 'PRIMARY KEY'
      )
	  LEFT JOIN "pg_class" ON TRUE
      AND "pg_class"."relname" = ${pg.escapeLiteral(tableName)}
	  LEFT JOIN "pg_attribute" ON TRUE
	    AND "pg_attribute"."attname" = "columns"."column_name"
	    AND "pg_class"."oid" = "pg_attribute"."attrelid"
    WHERE TRUE
      AND "columns"."table_name" = ${pg.escapeLiteral(tableName)}
      AND "columns"."table_schema" = 'public'
    ORDER BY "primaryKey" DESC, "name" ASC;
  `;

  const result = await context.dbClient.query(query);

  const rows: DbColumnSchema[] = [];

  for (const row of result.rows) {
    let columnType = columnTypes.find((columnType) => columnType.pgTypeOut.split(`|`).includes(row.type))!;
    if (row.isArray) {
      columnType = { ...arrayColumnType, memberType: columnType };
    }

    let defaultValue: DbColumnValue = typeof row.defaultValue === `string` ? parse(row.defaultValue) : row.defaultValue;

    const lengthMods = [row.length, row.precision, row.scale].filter((val) => val != null).join(`, `);
    const lengthText = lengthMods.length ? `(${lengthMods})` : ``;
    let preparedLabelOut: string;
    let preparedPgTypeIn: string;
    if (row.isArray) {
      const memberType = columnType.memberType!;
      const preparedArrayMemberPgLabelOut = memberType.labelOut.replace(`#`, lengthText);
      preparedLabelOut = columnType.labelOut.replace(`*`, preparedArrayMemberPgLabelOut);
      const preparedArrayMemberPgTypeIn = memberType.pgTypeIn.replace(`#`, lengthText);
      preparedPgTypeIn = columnType.pgTypeIn.replace(`*`, preparedArrayMemberPgTypeIn);
      defaultValue = defaultValue
        ? await Promise.all((defaultValue as any[]).map((value) => getTypedDefaultValue(value, memberType, context.dbClient, preparedArrayMemberPgTypeIn)))
        : defaultValue;
    }
    else {
      preparedLabelOut = columnType.labelOut.replace(`#`, lengthText);
      preparedPgTypeIn = columnType.pgTypeIn.replace(`#`, lengthText);
      defaultValue = await getTypedDefaultValue(defaultValue, columnType, context.dbClient, preparedPgTypeIn);
    }

    rows.push({
      ...row as DbColumnSchema,
      columnType,
      defaultValue,
      preparedLabelOut,
      preparedPgTypeIn,
    });
  }

  return rows;
}

async function getTypedDefaultValue(defaultValue: any, columnType: ColumnType, dbClient: DbClient, preparedPgTypeIn: string) {
  if (typeof defaultValue === `string`) {
    switch (columnType.labelIn) {
      // Types that PG returns as a non-string (e.g. number or Date), or that the user can
      // transform via `types.setTypeParser` when using the `pg` library.
      case EPgKeywords.DOUBLE_PRECISION_LABEL_IN:
      case EPgKeywords.INT_LABEL_IN:
      case EPgKeywords.REAL_LABEL_IN:
      case EPgKeywords.SMALLINT_LABEL_IN:
      case EPgKeywords.TIME_WITH_TIME_ZONE_LABEL_IN:
      case EPgKeywords.TIME_WITHOUT_TIME_ZONE_LABEL_IN:
      case EPgKeywords.TIMESTAMP_WITH_TIME_ZONE_LABEL_IN:
      case EPgKeywords.TIMESTAMP_WITHOUT_TIME_ZONE_LABEL_IN: {
        return (await dbClient.query<{ value: string }>(`SELECT ${pg.escapeLiteral(defaultValue)}::${preparedPgTypeIn} AS value`)).rows[0].value;
      }
      default: {
        return defaultValue;
      }
    }
  }
  else {
    return defaultValue;
  }
}
