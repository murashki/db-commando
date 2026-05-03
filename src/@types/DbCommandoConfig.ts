import type { DbTableConfig } from '../dbTableConstructor/@types/DbTableConfig.ts';
import type { DbConnection } from './DbConnection.ts';

export type DbCommandoConfig = {
  dbConnection: DbConnection;
  environment: string;
  masterMode: boolean;
  systemFolder?: string;
  tableConfigs?: Record<string, DbTableConfig>;
};
