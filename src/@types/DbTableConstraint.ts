import type { DbTableConstraintType } from './DbTableConstraintType';

export type DbTableConstraint = {
  checkClause: string | null;
  columns: string[];
  constraintName: string;
  constraintType: DbTableConstraintType;
  foreignColumns: string[];
  foreignTable: string | null;
  foreignTableSchema: string | null;
  onDelete: string | null;
  onUpdate: string | null;
};
