import pg from 'pg';
import type { DbTableConstraint } from '../@types/DbTableConstraint.ts';
import type { DbTableConstraintType } from '../@types/DbTableConstraintType.ts';
import type { DbCommandoContext } from '../@types/DbCommandoContext.ts';

const conTypeMap: Record<string, DbTableConstraintType> = {
  c: `CHECK`,
  f: `FOREIGN KEY`,
  u: `UNIQUE`,
};

export async function getDbTableConstraints(context: DbCommandoContext, tableName: string): Promise<DbTableConstraint[]> {
  const query = `
    SELECT
      "c"."conname" AS "constraintName",
      "c"."contype" AS "constraintType",
      ARRAY(
        SELECT "a"."attname"
        FROM UNNEST("c"."conkey") WITH ORDINALITY AS "k"("attnum", "ord")
        JOIN "pg_attribute" "a" ON "a"."attnum" = "k"."attnum" AND "a"."attrelid" = "c"."conrelid"
        ORDER BY "k"."ord"
      ) AS "columns",
      "ref_class"."relname" AS "foreignTable",
      "ref_ns"."nspname" AS "foreignTableSchema",
      ARRAY(
        SELECT "a"."attname"
        FROM UNNEST("c"."confkey") WITH ORDINALITY AS "k"("attnum", "ord")
        JOIN "pg_attribute" "a" ON "a"."attnum" = "k"."attnum" AND "a"."attrelid" = "c"."confrelid"
        ORDER BY "k"."ord"
      ) AS "foreignColumns",
      CASE "c"."confdeltype"
        WHEN 'a' THEN 'NO ACTION'
        WHEN 'r' THEN 'RESTRICT'
        WHEN 'c' THEN 'CASCADE'
        WHEN 'n' THEN 'SET NULL'
        WHEN 'd' THEN 'SET DEFAULT'
      END AS "onDelete",
      CASE "c"."confupdtype"
        WHEN 'a' THEN 'NO ACTION'
        WHEN 'r' THEN 'RESTRICT'
        WHEN 'c' THEN 'CASCADE'
        WHEN 'n' THEN 'SET NULL'
        WHEN 'd' THEN 'SET DEFAULT'
      END AS "onUpdate",
      pg_get_expr("c"."conbin", "c"."conrelid") AS "checkClause"
    FROM "pg_constraint" "c"
    JOIN "pg_class" "cls" ON "cls"."oid" = "c"."conrelid"
    JOIN "pg_namespace" "ns" ON "ns"."oid" = "cls"."relnamespace"
    LEFT JOIN "pg_class" "ref_class" ON "ref_class"."oid" = "c"."confrelid"
    LEFT JOIN "pg_namespace" "ref_ns" ON "ref_ns"."oid" = "ref_class"."relnamespace"
    WHERE "ns"."nspname" = 'public'
      AND "cls"."relname" = ${pg.escapeLiteral(tableName)}
      AND "c"."contype" IN ('f', 'u', 'c')
    ORDER BY "c"."contype", "c"."conname";
  `;

  const result = await context.dbConnection.query<{
    checkClause: string | null;
    columns: string[];
    constraintName: string;
    constraintType: string;
    foreignColumns: string[];
    foreignTable: string | null;
    foreignTableSchema: string | null;
    onDelete: string | null;
    onUpdate: string | null;
  }>(query);

  return result.rows.map((row) => ({
    ...row,
    constraintType: conTypeMap[row.constraintType],
  }));
}
