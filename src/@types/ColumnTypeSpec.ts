import type { ColumnTypeSpecKey } from './ColumnTypeSpecKey.ts';

export type ColumnTypeSpec = {
  defaultValue?: any;
  hints?: string[];
  key: ColumnTypeSpecKey;
  prompt: string;
};
