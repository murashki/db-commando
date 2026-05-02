import type { DbTable } from '../../../../dbTableConstructor/@types/DbTable.ts';
import type { DbTableAnyColumn } from '../../../../dbTableConstructor/@types/DbTableAnyColumn.ts';
import type { DbTableArrayOfAnyColumn } from '../../../../dbTableConstructor/@types/DbTableArrayOfAnyColumn.ts';
import type { DbTableConfig } from '../../../../dbTableConstructor/@types/DbTableConfig.ts';
import type { DbTableNumberColumn } from '../../../../dbTableConstructor/@types/DbTableNumberColumn.ts';
import type { DbTableStringColumn } from '../../../../dbTableConstructor/@types/DbTableStringColumn.ts';
import { getDbTableSchema } from '../../../../tools/getDbTableSchema.ts';
import { printDbTable } from '../../../../dbTableConstructor/printDbTable.ts';
import { EPgKeywords } from '../../../../@types/EPgKeywords.ts';
import type { AppContext } from '../../../../@types/AppContext.ts';

export async function handleViewRecordsModule(context: AppContext, table: DbTable): Promise<void> {
  const dbTableSchema = await getDbTableSchema(context, table.name);

  const columns = dbTableSchema.map((column) => {
    switch (column.columnType.labelIn) {
      case EPgKeywords.ARRAY_LABEL_IN: {
        const viewConfig = column.columnType.viewConfig as DbTableArrayOfAnyColumn;
        return {
          ...viewConfig,
          columnName: column.name,
        };
      }
      case EPgKeywords.CHAR_LABEL_IN: {
        const viewConfig = column.columnType.viewConfig as DbTableStringColumn;
        return {
          ...viewConfig,
          columnName: column.name,
          maxWidth: column.length ?? viewConfig.maxWidth!,
        };
      }
      case EPgKeywords.NUMERIC_LABEL_IN: {
        const viewConfig = column.columnType.viewConfig as DbTableNumberColumn;
        return {
          ...viewConfig,
          columnName: column.name,
          maxWidth: (column.precision ?? 10) + (column.scale ?? 5) + 1,
        };
      }
      case EPgKeywords.TIME_WITH_TIME_ZONE_LABEL_IN:
      case EPgKeywords.TIME_WITHOUT_TIME_ZONE_LABEL_IN:
      case EPgKeywords.TIMESTAMP_WITH_TIME_ZONE_LABEL_IN:
      case EPgKeywords.TIMESTAMP_WITHOUT_TIME_ZONE_LABEL_IN: {
        const viewConfig = column.columnType.viewConfig as DbTableStringColumn;
        return {
          ...viewConfig,
          columnName: column.name,
          maxWidth: viewConfig.maxWidth! + (column.precision ?? 6),
        };
      }
      case EPgKeywords.VARCHAR_LABEL_IN: {
        const viewConfig = column.columnType.viewConfig as DbTableStringColumn;
        return {
          ...viewConfig,
          columnName: column.name,
          maxWidth: column.length ?? viewConfig.maxWidth!,
        };
      }
      default: {
        const viewConfig = column.columnType.viewConfig as DbTableAnyColumn;
        return {
          ...viewConfig,
          columnName: column.name,
        };
      }
    }
  });

  const tableConfig: DbTableConfig = {
    columns,
    limit: 300,
    name: table.name,
    // TODO Could find the primary key and sort by it, but not now.
    // __dangerousOrderByTerm: ``,
  };

  await printDbTable(context, tableConfig);
}
