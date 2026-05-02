import type { DB_TABLE } from '../dbTableConstructor/DB_TABLE.ts';

export type ViewConfig = {
  dataType: (typeof DB_TABLE.COLUMN.TYPE)[keyof typeof DB_TABLE.COLUMN.TYPE];
  maxWidth: number;
};
