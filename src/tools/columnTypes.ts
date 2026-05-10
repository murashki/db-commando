import c from 'chalk';
import type { ColumnType } from '../@types/ColumnType.ts';
import { EPgKeywords } from '../@types/EPgKeywords.ts';
import { DB_TABLE } from '../dbTableConstructor/DB_TABLE.ts';
import { arrayColumnType } from './arrayColumnType.ts';

export const columnTypes: ColumnType[] = [
  arrayColumnType,
  {
    arrayEligible: true,
    editConfig: [
      {
        controlType: `text`,
        defaultValue: ``,
        label: `Manual input`,
      },
      {
        defaultValue: { type: `GEN_RANDOM_UUID` },
        label: c.italic(`GEN_RANDOM_UUID()`),
      }
    ],
    labelIn: EPgKeywords.UUID_LABEL_IN,
    labelOut: EPgKeywords.UUID_LABEL_OUT,
    nullability: false,
    pgTypeIn: EPgKeywords.UUID_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.UUID_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.UUID,
      maxWidth: 38,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `boolean`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.BOOLEAN_LABEL_IN,
    labelOut: EPgKeywords.BOOLEAN_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.BOOLEAN_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.BOOLEAN_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.BOOLEAN,
      maxWidth: 5,
    },
  },
  {
    arrayEligible: true,
    desc: `2 bytes, -32768 to +32767`,
    editConfig: {
      controlType: `number`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.SMALLINT_LABEL_IN,
    labelOut: EPgKeywords.SMALLINT_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.SMALLINT_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.SMALLINT_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      maxWidth: 6,
    },
  },
  {
    arrayEligible: true,
    desc: `4 bytes, -2147483648 to +2147483647`,
    editConfig: {
      controlType: `number`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.INT_LABEL_IN,
    labelOut: EPgKeywords.INT_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.INT_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.INT_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      maxWidth: 11,
    },
  },
  {
    arrayEligible: true,
    desc: `8 bytes, -9223372036854775808 to +9223372036854775807`,
    editConfig: {
      controlType: `bigint`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.BIGINT_LABEL_IN,
    labelOut: EPgKeywords.BIGINT_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.BIGINT_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.BIGINT_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      maxWidth: 20,
    },
  },
  {
    arrayEligible: true,
    desc: `Exact, up to 131072 digits before the decimal point, up to 16383 digits after the decimal point`,
    editConfig: {
      controlType: `number`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.NUMERIC_LABEL_IN,
    labelOut: EPgKeywords.NUMERIC_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.NUMERIC_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.NUMERIC_PG_TYPE_OUT,
    spec: [
      {
        key: `precision-typmods`,
        prompt: `Enter number precision`,
      },
      {
        key: `scale-typmods`,
        prompt: `Enter number scale`,
      },
    ],
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      // Calculated based on `precision` and `scale`
      maxWidth: 0,
    },
  },
  {
    arrayEligible: true,
    desc: `Inexact, 6 decimal digits precision`,
    editConfig: {
      controlType: `number`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.REAL_LABEL_IN,
    labelOut: EPgKeywords.REAL_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.REAL_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.REAL_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      maxWidth: 15,
    },
  },
  {
    arrayEligible: true,
    desc: `Inexact, 15 decimal digits precision`,
    editConfig: {
      controlType: `number`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.DOUBLE_PRECISION_LABEL_IN,
    labelOut: EPgKeywords.DOUBLE_PRECISION_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.DOUBLE_PRECISION_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.DOUBLE_PRECISION_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      maxWidth: 15,
    },
  },
  {
    arrayEligible: false,
    desc: `2 bytes, 1 to 32767`,
    editConfig: {
      defaultValue: null,
    },
    labelIn: EPgKeywords.SMALLSERIAL_LABEL_IN,
    labelOut: EPgKeywords.SMALLSERIAL_LABEL_OUT,
    nullability: false,
    pgTypeIn: EPgKeywords.SMALLSERIAL_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.SMALLSERIAL_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      maxWidth: 5,
    },
  },
  {
    arrayEligible: false,
    desc: `4 bytes, 1 to 2147483647`,
    editConfig: {
      defaultValue: null,
    },
    labelIn: EPgKeywords.SERIAL_LABEL_IN,
    labelOut: EPgKeywords.SERIAL_LABEL_OUT,
    nullability: false,
    pgTypeIn: EPgKeywords.SERIAL_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.SERIAL_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      maxWidth: 10,
    },
  },
  {
    arrayEligible: false,
    desc: `8 bytes, 1 to 9223372036854775807`,
    editConfig: {
      defaultValue: null,
    },
    labelIn: EPgKeywords.BIGSERIAL_LABEL_IN,
    labelOut: EPgKeywords.BIGSERIAL_LABEL_OUT,
    nullability: false,
    pgTypeIn: EPgKeywords.BIGSERIAL_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.BIGSERIAL_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.NUMBER,
      maxWidth: 15,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `text`,
      defaultValue: ``,
    },
    labelIn: EPgKeywords.CHAR_LABEL_IN,
    labelOut: EPgKeywords.CHAR_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.CHAR_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.CHAR_PG_TYPE_OUT,
    spec: [
      {
        key: `length-typmods`,
        prompt: `Enter char length`,
      },
    ],
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.STRING,
      maxWidth: 10,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `text`,
      defaultValue: ``,
    },
    labelIn: EPgKeywords.VARCHAR_LABEL_IN,
    labelOut: EPgKeywords.VARCHAR_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.VARCHAR_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.VARCHAR_PG_TYPE_OUT,
    spec: [
      {
        key: `length-typmods`,
        prompt: `Enter varchar length`,
      },
    ],
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.STRING,
      maxWidth: 10,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `text`,
      defaultValue: ``,
    },
    labelIn: EPgKeywords.TEXT_LABEL_IN,
    labelOut: EPgKeywords.TEXT_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.TEXT_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.TEXT_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.STRING,
      maxWidth: 30,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `date`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.DATE_LABEL_IN,
    labelOut: EPgKeywords.DATE_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.DATE_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.DATE_PG_TYPE_OUT,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.DATE,
      maxWidth: 10,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `datetime`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.TIMESTAMP_WITHOUT_TIME_ZONE_LABEL_IN,
    labelOut: EPgKeywords.TIMESTAMP_WITHOUT_TIME_ZONE_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.TIMESTAMP_WITHOUT_TIME_ZONE_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.TIMESTAMP_WITHOUT_TIME_ZONE_PG_TYPE_OUT,
    spec: [
      {
        defaultValue: null,
        key: `time-precision-typmods`,
        prompt: `Enter timestamp precision`,
      },
    ],
    timezone: false,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.DATETIME,
      maxWidth: 22,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `datetime`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.TIMESTAMP_WITH_TIME_ZONE_LABEL_IN,
    labelOut: EPgKeywords.TIMESTAMP_WITH_TIME_ZONE_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.TIMESTAMP_WITH_TIME_ZONE_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.TIMESTAMP_WITH_TIME_ZONE_PG_TYPE_OUT,
    spec: [
      {
        defaultValue: null,
        key: `time-precision-typmods`,
        prompt: `Enter timestamp precision`,
      },
    ],
    timezone: true,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.DATETIME,
      maxWidth: 28,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `time`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.TIME_WITHOUT_TIME_ZONE_LABEL_IN,
    labelOut: EPgKeywords.TIME_WITHOUT_TIME_ZONE_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.TIME_WITHOUT_TIME_ZONE_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.TIME_WITHOUT_TIME_ZONE_PG_TYPE_OUT,
    spec: [
      {
        defaultValue: null,
        key: `time-precision-typmods`,
        prompt: `Enter time precision`,
      },
    ],
    timezone: false,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.TIME,
      maxWidth: 11,
    },
  },
  {
    arrayEligible: true,
    editConfig: {
      controlType: `time`,
      defaultValue: null,
    },
    labelIn: EPgKeywords.TIME_WITH_TIME_ZONE_LABEL_IN,
    labelOut: EPgKeywords.TIME_WITH_TIME_ZONE_LABEL_OUT,
    nullability: true,
    pgTypeIn: EPgKeywords.TIME_WITH_TIME_ZONE_PG_TYPE_IN,
    pgTypeOut: EPgKeywords.TIME_WITH_TIME_ZONE_PG_TYPE_OUT,
    spec: [
      {
        defaultValue: null,
        key: `time-precision-typmods`,
        prompt: `Enter time precision`,
      },
    ],
    timezone: true,
    viewConfig: {
      dataType: DB_TABLE.COLUMN.TYPE.TIME,
      maxWidth: 17,
    },
  },
];
