import { handleCreateDbTableModule } from './modules/CreateDbTable/handleModule.ts';
import { handleDbTableAdminModule } from './modules/DbTableAdmin/handleModule.ts';
import { handleDropDbTableModule } from './modules/DropDbTable/handleModule.ts';
import { handleExecQueryModule } from './modules/ExecQuery/handleModule.ts';
import { handleQueryExecHistoryModule } from './modules/QueryExecHistory/handleModule.ts';
import { getCommonMenuOptions } from './tools/getCommonMenuOptions.ts';

export enum EPgCommandoMenuKey {
  BACK = `BACK`,
  CREATE_TABLE = `CREATE_TABLE`,
  EXEC_QUERY = `EXEC_QUERY`,
  QUERY_EXEC_HISTORY = `QUERY_EXEC_HISTORY`,
  REMOVE_TABLE = `REMOVE_TABLE`,
  TABLES = `TABLES`,
}

export const PG_COMMANDO_MENU_OPTIONS = getCommonMenuOptions([
  {
    key: EPgCommandoMenuKey.TABLES,
    label: `Tables...`,
    module: handleDbTableAdminModule,
  },
  {
    key: EPgCommandoMenuKey.CREATE_TABLE,
    label: `Create table...`,
    module: handleCreateDbTableModule,
  },
  {
    key: EPgCommandoMenuKey.REMOVE_TABLE,
    label: `Drop table...`,
    module: handleDropDbTableModule,
  },
  {
    key: EPgCommandoMenuKey.EXEC_QUERY,
    label: `Execute query...`,
    module: handleExecQueryModule,
  },
  {
    key: EPgCommandoMenuKey.QUERY_EXEC_HISTORY,
    label: `Query execution history`,
    module: handleQueryExecHistoryModule,
  },
  {
    key: EPgCommandoMenuKey.BACK,
    label: `Go back`,
  },
]);
