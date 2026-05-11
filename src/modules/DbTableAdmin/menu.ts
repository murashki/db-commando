import type { DbCommandoContext } from '../../@types/DbCommandoContext.ts';
import type { DbTable } from '../../dbTableConstructor/@types/DbTable.ts';
import { getCommonMenuOptions } from '../../tools/getCommonMenuOptions.ts';
import { handleAddColumnModule } from './modules/AddColumn/handleModule.ts';
import { handleAddPrimaryKeyModule } from './modules/AddPrimaryKey/handleModule.ts';
import { handleDropColumnModule } from './modules/DropColumn/handleModule.ts';
import { handleDropPrimaryKeyModule } from './modules/DropPrimaryKey/handleModule.ts';
import { handleDumpTableModule } from './modules/DumpTable/handleModule.ts';
import { handleInsertIntoTableModule } from './modules/InsertIntoTable/handleModule.ts';
import { handlePredefinedViewRecordsModule } from './modules/PredefinedViewRecords/handleModule.ts';
import { handlePredefinedViewRecordsWithCustomQueryModule } from './modules/PredefinedViewRecordsWithCustomQuery/handleModule.ts';
import { handleRenameColumnModule } from './modules/RenameColumn/handleModule.ts';
import { handleTruncateTableModule } from './modules/TruncateTable/handleModule.ts';
import { handleViewRecordsModule } from './modules/ViewRecords/handleModule.ts';
import { handleViewTableSchemaModule } from './modules/ViewTableSchema/handleModule.ts';

export enum EDbTableAdminMenuKey {
  ADD_COLUMN = `ADD_COLUMN`,
  ADD_PRIMARY_KEY = `ADD_PRIMARY_KEY`,
  BACK = `BACK`,
  DROP_COLUMN = `DROP_COLUMN`,
  DROP_PRIMARY_KEY = `DROP_PRIMARY_KEY`,
  DUMP_TABLE = `DUMP_TABLE`,
  INSERT_INTO_TABLE = `INSERT_INTO_TABLE`,
  PREDEFINED_VIEW_RECORDS = `PREDEFINED_VIEW_RECORDS`,
  PREDEFINED_VIEW_RECORDS_WITH_CUSTOM_QUERY = `PREDEFINED_VIEW_RECORDS_WITH_CUSTOM_QUERY`,
  RENAME_COLUMN = `RENAME_COLUMN`,
  TRUNCATE_TABLE = `TRUNCATE_TABLE`,
  VIEW_RECORDS = `VIEW_RECORDS`,
  VIEW_TABLE_SCHEMA = `VIEW_TABLE_SCHEMA`,
}

type DbTableAdminMenuItem = {
  key: string;
  label: string;
  module?: (context: DbCommandoContext, table: DbTable) => Promise<any>;
};

export const DB_TABLE_ADMIN_MENU_OPTIONS = getCommonMenuOptions<DbTableAdminMenuItem>([
  {
    key: EDbTableAdminMenuKey.VIEW_TABLE_SCHEMA,
    label: `View table schema`,
    module: handleViewTableSchemaModule,
  },
  {
    key: EDbTableAdminMenuKey.VIEW_RECORDS,
    label: `View records`,
    module: handleViewRecordsModule,
  },
  {
    key: EDbTableAdminMenuKey.PREDEFINED_VIEW_RECORDS,
    label: `View records (predefined view)`,
    module: handlePredefinedViewRecordsModule,
  },
  {
    key: EDbTableAdminMenuKey.PREDEFINED_VIEW_RECORDS_WITH_CUSTOM_QUERY,
    label: `View records (predefined view with custom query)...`,
    module: handlePredefinedViewRecordsWithCustomQueryModule,
  },
  {
    key: EDbTableAdminMenuKey.ADD_COLUMN,
    label: `Add column...`,
    module: handleAddColumnModule,
  },
  {
    key: EDbTableAdminMenuKey.RENAME_COLUMN,
    label: `Rename column...`,
    module: handleRenameColumnModule,
  },
  {
    key: EDbTableAdminMenuKey.DROP_COLUMN,
    label: `Drop column...`,
    module: handleDropColumnModule,
  },
  {
    key: EDbTableAdminMenuKey.ADD_PRIMARY_KEY,
    label: `Add primary key...`,
    module: handleAddPrimaryKeyModule,
  },
  {
    key: EDbTableAdminMenuKey.DROP_PRIMARY_KEY,
    label: `Drop primary key...`,
    module: handleDropPrimaryKeyModule,
  },
  {
    key: EDbTableAdminMenuKey.INSERT_INTO_TABLE,
    label: `Insert into table...`,
    module: handleInsertIntoTableModule,
  },
  {
    key: EDbTableAdminMenuKey.TRUNCATE_TABLE,
    label: `Truncate table...`,
    module: handleTruncateTableModule,
  },
  {
    key: EDbTableAdminMenuKey.DUMP_TABLE,
    label: `Dump table schema`,
    module: handleDumpTableModule,
  },
  {
    key: EDbTableAdminMenuKey.BACK,
    label: `Go back`,
  },
]);
