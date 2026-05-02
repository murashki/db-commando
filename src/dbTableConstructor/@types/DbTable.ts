import type { DbTableConfig } from './DbTableConfig.ts';

export type DbTable<
  TDbItem extends Record<string, any> = Record<string, any>,
> = {
  name: string,
  config?: DbTableConfig<TDbItem>,
}
