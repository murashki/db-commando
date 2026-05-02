import type { ColumnType } from '../@types/ColumnType.ts';
import { EPgKeywords } from '../@types/EPgKeywords.ts';
import { DB_TABLE } from '../dbTableConstructor/DB_TABLE.ts';

export const arrayColumnType: ColumnType = {
  arrayEligible: false,
  isArray: true,
  labelIn: EPgKeywords.ARRAY_LABEL_IN,
  labelOut: EPgKeywords.ARRAY_LABEL_OUT,
  nullability: true,
  pgTypeIn: EPgKeywords.ARRAY_PG_TYPE_IN,
  pgTypeOut: EPgKeywords.ARRAY_PG_TYPE_OUT,
  viewConfig: {
    dataType: DB_TABLE.COLUMN.TYPE.ARRAY_OF_ANY,
    maxWidth: 30,
  },
};
