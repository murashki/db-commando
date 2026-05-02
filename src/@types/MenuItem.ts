import type { AppContext } from './AppContext.ts';

export type MenuItem = {
  key: string;
  label: string;
  module?: (context: AppContext, ...args: any[]) => Promise<any>;
};
