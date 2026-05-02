import type { ColumnType } from '../@types/ColumnType.ts';

export function getArraySafeColumnType(columnType: ColumnType): ColumnType {
  return columnType.isArray ? getArraySafeColumnType(columnType.memberType!) : columnType;
}
