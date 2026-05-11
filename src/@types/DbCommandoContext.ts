import type { DbTableConfig } from '../dbTableConstructor/@types/DbTableConfig.ts';
import type { DbConfig } from '../tools';
import type { DbCommandoBootstrapConfig } from './DbCommandoBootstrapConfig.ts';
import type { DbConnection } from './DbConnection.ts';

export type DbCommandoContext = {
  dbCommandoConfig: {
    __dbCommandoBootstrapConfig: DbCommandoBootstrapConfig;
    dbConfig: DbConfig;
    environment: string;
    systemDir: string;
    tableConfigs: Record<string, DbTableConfig>;
  };
  dbConnection: DbConnection;
};
