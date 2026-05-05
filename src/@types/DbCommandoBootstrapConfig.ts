import type { DbTableConfig } from '../dbTableConstructor/@types/DbTableConfig.ts';
import type { DbConfig } from '../tools/@types/DbConfig.ts';
import type { DbConnection } from './DbConnection.ts';

export type DbCommandoBootstrapConfig = {
  dbConfig: DbConfig;
  environment: string;
  systemDir?: string;
  tableConfigs?: Record<string, DbTableConfig>;
};
