import type { DbTableConstraint } from '../@types/DbTableConstraint.ts';

export function buildConstraintsQuery(tableName: string, constraints: DbTableConstraint[]): string {
  return constraints
    .map((constraint) => {
      const prefix = `ALTER TABLE "public"."${tableName}" ADD CONSTRAINT "${constraint.constraintName}"`;

      if (constraint.constraintType === `UNIQUE`) {
        const cols = constraint.columns.map((column) => `"${column}"`).join(`, `);
        return `${prefix} UNIQUE (${cols});`;
      }

      if (constraint.constraintType === `FOREIGN KEY`) {
        const cols = constraint.columns.map((column) => `"${column}"`).join(`, `);
        const foreignCols = constraint.foreignColumns.map((column) => `"${column}"`).join(`, `);
        const foreignRef = `"${constraint.foreignTableSchema}"."${constraint.foreignTable}"`;
        const onDelete = constraint.onDelete && constraint.onDelete !== `NO ACTION` ? ` ON DELETE ${constraint.onDelete}` : ``;
        const onUpdate = constraint.onUpdate && constraint.onUpdate !== `NO ACTION` ? ` ON UPDATE ${constraint.onUpdate}` : ``;
        return `${prefix} FOREIGN KEY (${cols}) REFERENCES ${foreignRef} (${foreignCols})${onDelete}${onUpdate};`;
      }

      if (constraint.constraintType === `CHECK`) {
        return `${prefix} CHECK (${constraint.checkClause});`;
      }

      return ``;
    })
    .filter(Boolean)
    .join(`\n`);
}
