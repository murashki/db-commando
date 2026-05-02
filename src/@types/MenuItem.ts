import type { DbCommandoContext } from './DbCommandoContext.ts';

export type MenuItem = {
  key: string;
  label: string;
  module?: (context: DbCommandoContext, ...args: any[]) => Promise<any>;
};
