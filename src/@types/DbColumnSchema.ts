import type { ColumnType } from './ColumnType.ts';
import type { DbColumnValue } from './DbColumnValue.ts';

/**
 * Objects of this type are created from the DB response to a table structure query.
 */
export type DbColumnSchema = {
  columnType: ColumnType;
  defaultValue: DbColumnValue;
  defaultValueRaw: DbColumnValue;
  isArray: boolean;

  /**
   * For arrays, this describes the element type, not the array itself.
   */
  length: null | number;

  name: string;

  /**
   * In PG, an ARRAY column can be nullable or not nullable, but array elements are always nullable.
   */
  nullable: boolean;

  /**
   * For arrays, this describes the element type, not the array itself.
   */
  precision: null | number;

  /**
   * Derived from `columnType.labelOut`.
   */
  preparedLabelOut: string;

  /**
   * Derived from `columnType.pgTypeIn`.
   */
  preparedPgTypeIn: string;

  primaryKey: boolean;

  /**
   * For arrays, this describes the element type, not the array itself.
   */
  scale: null | number;

  /**
   * For arrays, this describes the element type, not the array itself.
   */
  timePrecision: number;

  /**
   * Used to look up `columnType` by matching against `pgTypeOut` of predefined `ColumnType`
   * objects. Thus `type` always equals `columnType.pgTypeOut`. The property itself is not used
   * directly — it exists because the DB query response includes a column named `type`.
   */
  type: string;
};
