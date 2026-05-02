import type { DbTableStringReplaceMapRender } from './@types/DbTableStringReplaceMapRender.ts';
import type { DbTableStringReplaceRender } from './@types/DbTableStringReplaceRender.ts';
import { __STRING_REPLACE_MAP_RENDER_SYMBOL__ } from './constants.ts';
import { __STRING_REPLACE_RENDER_SYMBOL__ } from './constants.ts';

export const DB_TABLE = {
  COLUMN: {
    TYPE: {
      ANY: `COLUMN.TYPE.ANY`,
      ARRAY_OF_ANY: `COLUMN.TYPE.ARRAY_OF_ANY`,
      ARRAY_OF_BOOLEAN: `COLUMN.TYPE.ARRAY_OF_BOOLEAN`,
      ARRAY_OF_NUMBER: `COLUMN.TYPE.ARRAY_OF_NUMBER`,
      ARRAY_OF_STRING: `COLUMN.TYPE.ARRAY_OF_STRING`,
      DATE: 'COLUMN.TYPE.DATE',
      DATETIME: 'COLUMN.TYPE.DATETIME',
      BOOLEAN: `COLUMN.TYPE.BOOLEAN`,
      NUMBER: `COLUMN.TYPE.NUMBER`,
      STRING: `COLUMN.TYPE.STRING`,
      TIME: 'COLUMN.TYPE.TIME',
      UUID: `COLUMN.TYPE.UUID`,
    },
    RENDER: {
      STRING: {
        REPLACE_MAP: (replaceMap: Record<string, null | boolean | number | string>): DbTableStringReplaceMapRender => {
          return { type: __STRING_REPLACE_MAP_RENDER_SYMBOL__, replaceMap };
        },
        REPLACE: (pattern: string, replacement: string): DbTableStringReplaceRender => {
          return { type: __STRING_REPLACE_RENDER_SYMBOL__, pattern, replacement };
        },
      },
    },
  },
} as const;
