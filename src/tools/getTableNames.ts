import type { AppContext } from '../@types/AppContext.ts';

export async function getTableNames(context: AppContext): Promise<string[]> {
  const result = await context.dbClient.query<{ tableName: string }>(`
    SELECT "tablename" AS "tableName"
    FROM "pg_catalog"."pg_tables"
    WHERE "schemaname" NOT IN ('information_schema', 'pg_catalog');
  `);

  return result.rows
    .sort((a, b) => {
      return a.tableName > b.tableName ? 1 : -1;
    })
    .map((row) => row.tableName);
}
