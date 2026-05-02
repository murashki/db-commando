import type { DbTableConfig } from '../dbTableConstructor/@types/DbTableConfig.ts';
import type { DbClient } from './DbClient.ts';
import type { Environment } from './Environment.ts';

export type DbCommandoContext = {
  dbClient: DbClient;
  environment: Environment;
  masterMode: boolean;
  systemFolder: string;
  tableConfigs?: Record<string, DbTableConfig>;
};
