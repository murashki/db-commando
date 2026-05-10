import { handleCreateDbTableModule } from './modules/CreateDbTable/handleModule.ts';
import { handleDbTableAdminModule } from './modules/DbTableAdmin/handleModule.ts';
import { handleDropDbTableModule } from './modules/DropDbTable/handleModule.ts';
import { handleExecQueryModule } from './modules/ExecQuery/handleModule.ts';
import { handleQueryExecHistoryModule } from './modules/QueryExecHistory/handleModule.ts';
import { handleServerInfoModule } from './modules/ServerInfo/handleModule.ts';
import { getCommonMenuOptions } from './tools/getCommonMenuOptions.ts';

export enum EDbCommandoMenuKey {
  BACK = `BACK`,
  CREATE_TABLE = `CREATE_TABLE`,
  EXEC_QUERY = `EXEC_QUERY`,
  QUERY_EXEC_HISTORY = `QUERY_EXEC_HISTORY`,
  SERVER_INFO = `SERVER_INFO`,
  REMOVE_TABLE = `REMOVE_TABLE`,
  TABLES = `TABLES`,
}

export const DB_COMMANDO_MENU_OPTIONS = getCommonMenuOptions([
  {
    key: EDbCommandoMenuKey.TABLES,
    label: `Tables...`,
    module: handleDbTableAdminModule,
  },
  {
    key: EDbCommandoMenuKey.CREATE_TABLE,
    label: `Create table...`,
    module: handleCreateDbTableModule,
  },
  {
    key: EDbCommandoMenuKey.REMOVE_TABLE,
    label: `Drop table...`,
    module: handleDropDbTableModule,
  },
  {
    key: EDbCommandoMenuKey.EXEC_QUERY,
    label: `Execute query...`,
    module: handleExecQueryModule,
  },
  {
    key: EDbCommandoMenuKey.QUERY_EXEC_HISTORY,
    label: `Query execution history`,
    module: handleQueryExecHistoryModule,
  },
  {
    key: EDbCommandoMenuKey.SERVER_INFO,
    label: `Server info`,
    module: handleServerInfoModule,
  },
  {
    key: EDbCommandoMenuKey.BACK,
    label: `Go back`,
  },
]);
