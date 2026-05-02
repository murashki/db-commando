import pg from 'pg';
import type { DbTableConfig } from './@types/DbTableConfig.ts';

export function getQuery(config: DbTableConfig<any>) {
  if (config.query) {
    return config.query;
  }
  else {
    const columnsClause = config.columns
      .map((column) => pg.escapeIdentifier(column.columnName))
      .join(`, `);

    // TODO SQL injection
    return `
      SELECT ${columnsClause}
      FROM public.${pg.escapeIdentifier(config.name)}
      ${config.__dangerousWhereTerm ? `WHERE ${config.__dangerousWhereTerm}` : ``}
      ${config.__dangerousOrderByTerm ? `ORDER BY ${config.__dangerousOrderByTerm}` : ``}
      ${config.limit ? `LIMIT ${String(Number(config.limit) ?? 0)}` : ``}
    `.trim().split(`\n`).map((line) => line.trim()).filter(Boolean).join(`\n`);
  }
}
